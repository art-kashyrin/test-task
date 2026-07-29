import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ErrorResponseDto } from '../common/dto/error-response.dto'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { RegisteredUserDto } from './dto/registered-user.dto'
import { AuthTokenDto } from './dto/auth-token.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, type: RegisteredUserDto })
  @ApiResponse({ status: 400, type: ErrorResponseDto })
  @ApiResponse({ status: 409, type: ErrorResponseDto })
  register(@Body() dto: RegisterDto): Promise<RegisteredUserDto> {
    return this.authService.register(dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, type: AuthTokenDto })
  @ApiResponse({ status: 401, type: ErrorResponseDto })
  login(@Body() dto: LoginDto): Promise<AuthTokenDto> {
    return this.authService.login(dto)
  }
}
