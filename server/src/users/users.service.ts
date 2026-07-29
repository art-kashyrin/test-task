import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { City } from '../cities/city.entity'
import type { CityStatsPageDto } from './dto/city-stats-page.dto'

interface CityStatRow {
  name: string
  state: string
  count: number
}

@Injectable()
export class UsersService {
  constructor(@InjectRepository(City) private readonly cities: Repository<City>) {}

  async getCityStats(limit: number, offset: number): Promise<CityStatsPageDto> {
    const [rows, totalRow] = await Promise.all([
      this.cities
        .createQueryBuilder('c')
        .innerJoin('c.users', 'u')
        .select('c.name', 'name')
        .addSelect('c.state', 'state')
        .addSelect('COUNT(u.id)::int', 'count')
        .groupBy('c.id')
        .addGroupBy('c.name')
        .addGroupBy('c.state')
        .orderBy('c.name', 'ASC')
        .addOrderBy('c.state', 'ASC')
        .limit(limit)
        .offset(offset)
        .getRawMany<CityStatRow>(),
      this.cities
        .createQueryBuilder('c')
        .innerJoin('c.users', 'u')
        .select('COUNT(DISTINCT c.id)::int', 'count')
        .getRawOne<{ count: number }>(),
    ])

    return {
      items: rows.map((row) => ({ city: `${row.name}, ${row.state}`, count: row.count })),
      total: totalRow?.count ?? 0,
      limit,
      offset,
    }
  }
}
