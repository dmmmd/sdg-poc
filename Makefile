.PHONY: build up down clean up down clean migrate generate-migration seed generate-seed

up:
	docker compose -f dev-env/docker-compose.dev.yml build --no-cache
	docker compose -f dev-env/docker-compose.dev.yml up -d

down:
	docker compose -f dev-env/docker-compose.dev.yml down

clean:
	docker compose -f dev-env/docker-compose.dev.yml down -v

migrate:
	docker compose -f dev-env/docker-compose.dev.yml exec api npx knex migrate:latest --knexfile src/storage/knexfile.ts

generate-migration:
	docker compose -f dev-env/docker-compose.dev.yml exec api npx knex migrate:make $$name --knexfile src/storage/knexfile.ts

seed:
	docker compose -f dev-env/docker-compose.dev.yml exec api npx knex seed:run --knexfile src/storage/knexfile.ts

generate-seed:
	docker compose -f dev-env/docker-compose.dev.yml exec api npx knex seed:make $$name --knexfile src/storage/knexfile.ts
