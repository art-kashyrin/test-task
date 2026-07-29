import type { MigrationInterface, QueryRunner } from 'typeorm'
import { US_CITIES } from '../seeds/us-cities'

interface CityInsertRow {
  name: string
  state: string
}

export class SeedCities1753800001000 implements MigrationInterface {
  name = 'SeedCities1753800001000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into<CityInsertRow>('cities', ['name', 'state'])
      .values(US_CITIES.map(([name, state]) => ({ name, state })))
      .orIgnore()
      .execute()
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const [name, state] of US_CITIES) {
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from('cities')
        .where('name = :name AND state = :state', { name, state })
        .execute()
    }
  }
}
