import { ApiProperty } from '@nestjs/swagger'

export class CityStatDto {
  @ApiProperty({ type: String, description: '"City, ST" display form' })
  city!: string

  @ApiProperty({ type: Number })
  count!: number
}
