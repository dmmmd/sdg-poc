.PHONY: up down clean dev-up dev-down dev-clean migrate-dev generate-migration

up:
	docker-compose build --no-cache
	docker-compose up -d

down:
	docker-compose down

clean:
	docker-compose down -v

dev-up:
	docker compose -f dev-env/docker-compose.dev.yml build --no-cache
	docker compose -f dev-env/docker-compose.dev.yml up -d

dev-down:
	docker compose -f dev-env/docker-compose.dev.yml down

dev-clean:
	docker compose -f dev-env/docker-compose.dev.yml down -v

migrate-dev:
	docker compose -f dev-env/docker-compose.dev.yml exec api npx knex migrate:latest --knexfile src/storage/knexfile.ts

generate-migration:
	docker compose -f dev-env/docker-compose.dev.yml exec api npx knex migrate:make $$name --knexfile src/storage/knexfile.ts
