import type { MigrationInterface, QueryRunner } from 'typeorm'

export class InitSchema1753800000000 implements MigrationInterface {
  name = 'InitSchema1753800000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE cities (
        id    serial PRIMARY KEY,
        name  varchar(120) NOT NULL,
        state char(2)      NOT NULL,
        CONSTRAINT uq_cities_name_state UNIQUE (name, state)
      );
    `)
    await queryRunner.query(`
      CREATE TABLE users (
        id            serial PRIMARY KEY,
        name          varchar(120) NOT NULL,
        surname       varchar(120) NOT NULL,
        password_hash varchar(60)  NOT NULL,
        city_id       integer      NOT NULL REFERENCES cities(id),
        created_at    timestamptz  NOT NULL DEFAULT now(),
        CONSTRAINT uq_users_name UNIQUE (name)
      );
    `)
    await queryRunner.query(`CREATE INDEX idx_users_city_id ON users (city_id);`)
    await queryRunner.query(`CREATE INDEX idx_cities_name_state ON cities (name, state);`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS users;`)
    await queryRunner.query(`DROP TABLE IF EXISTS cities;`)
  }
}
