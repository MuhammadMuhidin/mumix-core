.PHONY: build up down

# Jalankan semua service
up:
	docker compose up

# Stop dan hapus container
down:
	docker compose down
