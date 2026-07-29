import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import { City } from '../cities/city.entity'
import { User } from '../users/user.entity'
import { isUniqueViolation } from '../common/is-unique-violation'
import type { RegisterDto } from './dto/register.dto'
import type { LoginDto } from './dto/login.dto'
import type { RegisteredUserDto } from './dto/registered-user.dto'
import type { AuthTokenDto } from './dto/auth-token.dto'

const BCRYPT_SALT_ROUNDS = 12

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(City) private readonly cities: Repository<City>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisteredUserDto> {
    const city = await this.cities.findOne({ where: { id: dto.city } })
    if (city === null) {
      throw new BadRequestException('Unknown city')
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS)

    try {
      const user = await this.users.save(
        this.users.create({
          name: dto.name,
          surname: dto.surname,
          passwordHash,
          city,
        }),
      )
      return { id: user.id, name: user.name }
    } catch (error: unknown) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('A user with this name already exists')
      }
      throw error
    }
  }

  async login(dto: LoginDto): Promise<AuthTokenDto> {
    const user = await this.users.findOne({ where: { name: dto.name } })
    if (user === null) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash)
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id, name: user.name })
    return { accessToken }
  }
}
