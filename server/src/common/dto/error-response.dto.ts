import { ApiProperty } from '@nestjs/swagger'

export class ErrorResponseDto {
  @ApiProperty({ type: Number })
  statusCode!: number

  @ApiProperty({ type: String })
  message!: string | string[]

  @ApiProperty({ type: String, required: false })
  error?: string
}
