all: help

local:
	@docker-compose -f './backend/docker-compose.yaml' up -d
	@concurrently "npm run dev --prefix frontend" "npm run start:dev --prefix backend"

docker:
	@docker-compose up --build -d

help:
	@echo "DocuAI"
	@echo "\tmake local - run all services locally"
	@echo "\tmake docker - run all services in Docker"