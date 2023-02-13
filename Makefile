install:
	pnpm install
	cp .env.dist .env
	docker compose up -d
	pnpm prisma db push

start_db:
	docker compose up -d

stop_db:
	docker compose stop
