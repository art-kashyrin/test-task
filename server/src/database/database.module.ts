import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { buildDataSourceOptions } from '../config/database.config'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...buildDataSourceOptions(),

        manualInitialization: process.env.OPENAPI_EMIT === '1',
      }),
    }),
  ],
})
export class DatabaseModule {}
