import { AppDataSource } from './data-source'

async function main(): Promise<void> {
  await AppDataSource.initialize()
  await AppDataSource.runMigrations()
  await AppDataSource.destroy()
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
