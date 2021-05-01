.PHONY: start install psql

# Decrypt local env secrets to file .env.local
# You must belong to team dog_diary in Keybase to be able to decrypt secrets
.env.local:
	keybase decrypt --infile=encrypted/local-env --outfile=.env.local

# Start project in dev mode
start: .env.local
	yarn next dev

# Install dependencies
install:
	yarn install --frozen-lockfile

# Connect to Postgres database via psql
psql: .env.local
	source .env.local && \
	PGPASSWORD="$$POSTGRES_PASSWORD" psql \
	--host="$$POSTGRES_HOST" \
	--port="$$PORSTEG_PORT" \
	--username="$$POSTGRES_USER" \
	--dbname="$$POSTGRES_DATABASE"
