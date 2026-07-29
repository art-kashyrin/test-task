import { Module } from '@nestjs/common'
import { JwtModule, type JwtSignOptions } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { env } from '../config/env'
import { City } from '../cities/city.entity'
import { User } from '../users/user.entity'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'

const jwtExpiresIn = env.JWT_EXPIRES_IN as unknown as JwtSignOptions['expiresIn']

@Module({
  imports: [
    TypeOrmModule.forFeature([User, City]),
    PassportModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: jwtExpiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
