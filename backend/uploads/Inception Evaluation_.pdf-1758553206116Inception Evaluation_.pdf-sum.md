# Summary: Project Inception Evaluation Guidelines

## Overview
This document outlines evaluation guidelines for the **Inception project** at 42 School, focusing on Docker-based infrastructure setup. The project requires students to deploy services using Docker and Docker Compose.

---

## Evaluation Rules & Guidelines
- **Politeness and respect** are mandatory throughout the process.
- Evaluators must **identify and discuss** project dysfunctions constructively.
- Only grade work submitted in the **student’s Git repository**.
- Verify repository authenticity and avoid malicious aliases.
- Use flags to report issues like empty repositories, non-functional programs, or cheating—resulting in a grade of 0 (or -42 for cheating).

---

## Preliminary Checks
- Suspected cheating halts the evaluation immediately.
- Ensure no credentials or API keys are exposed in the repository.
- The defense can only proceed if the evaluated student is present.
- Required files must be in a `srcs` folder at the repository root.
- A `Makefile` must be present at the root.

---

## Docker Setup Requirements
- Run cleanup command before evaluation:  
  `docker stop $(docker ps -qa); docker rm $(docker ps -qa); docker rmi -f $(docker images -qa); docker volume rm $(docker volume ls -q); docker network rm $(docker network ls -q) 2>/dev/null`
- Check `docker-compose.yml` for:
  - No `network: host` or `links`.
  - Presence of defined networks.
- Dockerfiles must:
  - Be non-empty and per service.
  - Use the penultimate stable version of Alpine/Debian.
  - Avoid infinite loops, background commands, or improper entrypoints.

---

## Mandatory Part Checks
### Project Overview
The student must explain:
- How Docker and Docker Compose work.
- Differences between using Docker images with/without Docker Compose.
- Benefits of Docker over VMs.
- Relevance of the required directory structure.

### Simple Setup
- NGINX must be accessible **only via port 443** with SSL/TLS.
- WordPress must be properly installed (no installation page visible).
- Access via `https://login.42.fr` (replacing `login` with the student’s login).

### Docker Basics
- One Dockerfile per service; all must be non-empty.
- Images must be built by the student (no pre-made images).
- Images must be named after their services.
- Services must be set up via Docker Compose without crashes.

### Docker Network
- Use of `docker-network` must be verified in `docker-compose.yml` and via `docker network ls`.

### NGINX with SSL/TLS
- Must have a Dockerfile.
- Container must be created and accessible only via HTTPS.
- TLS v1.2/v1.3 certificate required (self-signed acceptable).

### WordPress with php-fpm and Volume
- Must have a Dockerfile (no NGINX inside).
- Volume must exist and map to `/home/login/data` (replace `login`).
- Must support adding comments and admin access (admin username must not include "admin").
- Page edits must persist.

### MariaDB and Volume
- Must have a Dockerfile (no NGINX).
- Volume must exist and map to `/home/login/data`.
- Student must explain how to log into the database; it should not be empty.

### Persistence
- After rebooting the VM and restarting Docker Compose, all services must remain functional, with WordPress changes preserved.

---

## Bonus Part
- Evaluate **only if** the mandatory part is perfect.
- Add 1 point per authorized bonus service.
- Test functionality and implementation.
- For free-choice services, the student must explain its usefulness and functionality.
- Rate each bonus from 0 (failed) to 5 (excellent).

---

## Final Steps
- Check the appropriate flag for the defense (e.g., Ok, Outstanding, Empty work, etc.).
- Leave a comment (max 2048 characters).

--- 

*Note: All instructions assume compliance with 42 School’s evaluation standards and subject requirements.*