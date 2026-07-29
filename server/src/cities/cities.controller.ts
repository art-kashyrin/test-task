import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { CitiesService } from './cities.service'
import { CityDto } from './dto/city.dto'

@ApiTags('cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  @ApiOkResponse({ type: CityDto, isArray: true })
  findAll(): Promise<CityDto[]> {
    return this.citiesService.findAll()
  }
}
