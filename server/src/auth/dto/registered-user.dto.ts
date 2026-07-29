import { ApiProperty } from '@nestjs/swagger'

export class RegisteredUserDto {
  @ApiProperty({ type: Number })
  id!: number

  @ApiProperty({ type: String })
  name!: string
}
