import { ApiProperty } from '@nestjs/swagger'
import { CityStatDto } from './city-stat.dto'

export class CityStatsPageDto {
  @ApiProperty({ type: CityStatDto, isArray: true })
  items!: CityStatDto[]

  @ApiProperty({ type: Number })
  total!: number

  @ApiProperty({ type: Number })
  limit!: number

  @ApiProperty({ type: Number })
  offset!: number
}
