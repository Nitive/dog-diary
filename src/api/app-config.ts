export function requiredEnv(env: string): string {
  const value = process.env[env]
  if (!value) {
    throw new Error(`${env} environment variable is not defined`)
  }

  return value
}

// TODO: put app config in context to mock it in tests
export const appConfig = {
  psql: {
    user: requiredEnv("POSTGRES_USER"),
    database: requiredEnv("POSTGRES_DATABASE"),
    password: requiredEnv("POSTGRES_PASSWORD"),
    host: requiredEnv("POSTGRES_HOST"),
    port: Number(requiredEnv("POSTGRES_PORT")),
  },
}
