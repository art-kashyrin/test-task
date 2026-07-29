import { Module } from '@nestjs/common'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module'
import { CitiesModule } from './cities/cities.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [DatabaseModule, AuthModule, CitiesModule, UsersModule],
})
export class AppModule {}
