all: help

local:
	@concurrently "npm run dev --prefix frontend" "npm run start:dev --prefix backend"

docker:
	@docker-compose up --build -d