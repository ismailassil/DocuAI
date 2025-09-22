# Summary: Project Inception Evaluation Guidelines

## Overview
This document outlines the evaluation process for the **Inception** project at 42, focusing on Docker-based infrastructure setup. The evaluation must be conducted respectfully, constructively, and honestly, adhering to specific technical and procedural guidelines.

---

## Key Evaluation Rules
- **Politeness and Respect**: Maintain a courteous and constructive tone.
- **Identify Issues**: Discuss potential dysfunctions with the student.
- **Open-Mindedness**: Account for differences in interpretation of project instructions.
- **Git Repository Focus**: Only grade submitted work in the student’s Git repository.
- **Pre-checks**: Verify repository ownership, avoid malicious aliases, and review automation scripts if used.
- **Flag Usage**: Report issues like empty repositories, non-functional programs, Norm errors, or cheating with appropriate flags (e.g., Cheat flag results in a grade of -42).

---

## Technical Requirements
### Preliminaries
- Suspected cheating halts the evaluation.
- Use a local `.env` file for sensitive data; exposed credentials result in a grade of 0.
- Defense requires the student’s presence.

### General Instructions
- All configuration files must reside in a `srcs` folder at the repository root.
- A `Makefile` must be present at the root.
- Run cleanup commands before evaluation:
  ```bash
  docker stop $(docker ps -qa); docker rm $(docker ps -qa); docker rmi -f $(docker images -qa); docker volume rm $(docker volume ls -q); docker network rm $(docker network ls -q) 2>/dev/null
  ```
- **docker-compose.yml** must not contain `network: host` or `links:` but must define networks.
- **Dockerfiles**:
  - Must not use `--link`, `tail -f`, background commands, or infinite loops.
  - Must use the penultimate stable version of Alpine or Debian.
  - Entrypoint scripts must not run programs in the background.
- Run the `Makefile` to set up services.

---

## Mandatory Part
### Project Overview
The student must explain:
- How Docker and Docker Compose work.
- Differences between using Docker images with and without Docker Compose.
- Benefits of Docker over VMs.
- Relevance of the required directory structure.

### Simple Setup
- NGINX must be accessible only via port 443 with SSL/TLS.
- WordPress must be fully installed (no installation page visible).
- Access via `https://login.42.fr` (student’s login), not HTTP.

### Docker Basics
- One Dockerfile per service; must not be empty or pre-made.
- Images must be named after their service and built from specified base images.
- Services must be set up via Docker Compose without crashes.

### Docker Network
- Use `docker-network`; verify with `docker network ls`.
- Student must explain Docker networks.

### NGINX with SSL/TLS
- Dockerfile required.
- Container must be created; HTTP access must fail.
- HTTPS must show WordPress (not installation page) with TLS v1.2/v1.3 (self-signed allowed).

### WordPress with php-fpm and Volume
- Dockerfile required (no NGINX).
- Volume must exist with path `/home/login/data` (student’s login).
- Must support adding comments and admin access (admin username not containing "admin").
- Edits must persist.

### MariaDB and Volume
- Dockerfile required (no NGINX).
- Volume must exist with path `/home/login/data`.
- Student must explain database login; database must not be empty.

### Persistence
- Reboot VM, restart Docker Compose, and verify functionality and data persistence.

---

## Bonus Part
- Evaluate only if the mandatory part is perfect.
- Add 1 point per authorized bonus service.
- Test functionality; student must explain any free-choice service.
- Rate bonuses from 0 (failed) to 5 (excellent).

---

## Final Steps
- Check the defense flag.
- Leave a comment (max 2048 characters).
- Ratings include options like "Ok," "Outstanding project," "Empty work," etc.

---

## Legal
- Compliance with API terms, cookie use, site terms, legal notices, and privacy policy required.