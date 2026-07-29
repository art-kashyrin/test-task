import { Type } from 'class-transformer'
import { IsInt, IsString, Length, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ type: String })
  @IsString()
  @Length(2, 120)
  name!: string

  @ApiProperty({ type: String })
  @IsString()
  @Length(2, 120)
  surname!: string

  @ApiProperty({ type: Number, description: 'Identifier of a seeded city (cities.id)' })
  @Type(() => Number)
  @IsInt()
  city!: number

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(8)
  password!: string
}
