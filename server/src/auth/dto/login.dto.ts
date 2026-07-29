import { IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ type: String })
  @IsString()
  name!: string

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(8)
  password!: string
}
