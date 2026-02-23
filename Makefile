.PHONY: build up down rebuild logs fe-build be-build fe-up be-up

# Down Build Up
refresh: down build-all up

# Jalankan semua service
up:
	docker compose up

# Stop dan hapus container
down:
	docker compose down

# Build semua service
build-all:
	docker compose build --no-cache

# Build frontend saja
fe-build:
	docker compose build frontend --no-cache

# Build backend saja
be-build:
	docker compose build backend --no-cache