import { QueryFailedError } from 'typeorm'

interface PgDriverError {
  code?: string
}

const POSTGRES_UNIQUE_VIOLATION = '23505'

export function isUniqueViolation(error: unknown): boolean {
  if (!(error instanceof QueryFailedError)) {
    return false
  }
  const driverError: unknown = error.driverError
  const code = (driverError as PgDriverError).code
  return code === POSTGRES_UNIQUE_VIOLATION
}
