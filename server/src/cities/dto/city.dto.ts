import { ApiProperty } from '@nestjs/swagger'

export class CityDto {
  @ApiProperty({ type: Number })
  id!: number

  @ApiProperty({ type: String })
  name!: string

  @ApiProperty({ type: String })
  state!: string

  @ApiProperty({ type: String, description: '"City, ST" display form' })
  displayName!: string
}
