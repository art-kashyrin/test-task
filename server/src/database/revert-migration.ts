import { AppDataSource } from './data-source'

async function main(): Promise<void> {
  await AppDataSource.initialize()
  await AppDataSource.undoLastMigration()
  await AppDataSource.destroy()
}

main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
