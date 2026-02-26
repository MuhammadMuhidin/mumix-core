.PHONY: up down build-local-fe build-local-be help

# Jalankan semua service
up:
	docker compose up

# Stop dan hapus container
down:
	docker compose down

# Build fe local image
build-local-fe:
	docker build -t local-core-fe:dev ./frontend

# Build be local image
build-local-be:
	docker build -t local-core-be:dev ./backend

# Help
help:
	@echo "usage: make up -> spin up all service (images from dockerhub will be used)"
	@echo "usage: make down -> stop all service"
	@echo "usage: make build-local-fe or build-local-be -> build local image (dev tag)"
