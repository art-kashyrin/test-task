function requireEnv(key: string): string {
  const value = process.env[key]
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function optionalEnv(key: string, defaultValue: string): string {
  const value = process.env[key]
  return value === undefined || value === '' ? defaultValue : value
}

export const env = {
  DATABASE_HOST: optionalEnv('DATABASE_HOST', 'localhost'),
  DATABASE_PORT: Number(optionalEnv('DATABASE_PORT', '5432')),
  DATABASE_USER: requireEnv('DATABASE_USER'),
  DATABASE_PASSWORD: requireEnv('DATABASE_PASSWORD'),
  DATABASE_NAME: requireEnv('DATABASE_NAME'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: optionalEnv('JWT_EXPIRES_IN', '1d'),
  API_PORT: Number(optionalEnv('API_PORT', '3000')),
}
