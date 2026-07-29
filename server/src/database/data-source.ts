import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { buildDataSourceOptions } from '../config/database.config'

export const AppDataSource = new DataSource(buildDataSourceOptions())
