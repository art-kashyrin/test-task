import { ApiProperty } from '@nestjs/swagger'

export class AuthTokenDto {
  @ApiProperty({ type: String })
  accessToken!: string
}
