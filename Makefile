.PHONY: build up down rebuild logs fe-build be-build fe-up be-up

# Down Build Up
refresh: down build up

# Build semua service
build:
	docker compose build --no-cache

# Jalankan semua service
up:
	docker compose up

# Stop dan hapus container
down:
	docker compose down

# Rebuild lalu jalankan
rebuild:
	docker compose up --build --no-cache

# Follow logs
logs:
	docker compose logs -f

# Build frontend saja
fe-build:
	docker compose build frontend

# Build backend saja
be-build:
	docker compose build backend

# Jalankan frontend saja
fe-up:
	docker compose up frontend

# Jalankan backend saja
be-up:
	docker compose up backend