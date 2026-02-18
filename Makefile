.PHONY: all run-backend run-frontend

all:
	make -j2 run-backend run-frontend

run-backend:
	cd backend && npm install && npm start

run-frontend:
	cd frontend && npm run build && npm run start