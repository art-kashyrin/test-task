import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { City } from './city.entity'
import type { CityDto } from './dto/city.dto'

@Injectable()
export class CitiesService {
  constructor(@InjectRepository(City) private readonly cities: Repository<City>) {}

  async findAll(): Promise<CityDto[]> {
    const cities = await this.cities.find({ order: { name: 'ASC', state: 'ASC' } })
    return cities.map((city) => ({
      id: city.id,
      name: city.name,
      state: city.state,
      displayName: `${city.name}, ${city.state}`,
    }))
  }
}
