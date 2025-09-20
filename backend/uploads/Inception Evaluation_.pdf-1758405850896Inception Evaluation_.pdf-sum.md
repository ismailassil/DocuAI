# Project Inception Evaluation Guidelines Summary

## Introduction
- Evaluators must remain polite, respectful, and constructive throughout the process.
- Identify and discuss potential dysfunctions in the project.
- Maintain an open mind regarding differences in project interpretation.
- Only grade work submitted in the student's Git repository.

## Preliminary Checks
- Verify the Git repository belongs to the correct student.
- Ensure no malicious aliases are used.
- Review any grading scripts together if applicable.
- Read the entire subject if you haven't completed the project yourself.
- Use flags to report issues like empty repositories, non-functioning programs, Norm errors, or cheating (which results in a grade of -42).

## General Instructions
- All configuration files must be in a `srcs` folder at the repository root.
- A `Makefile` must be present at the root.
- Run cleanup commands before evaluation: `docker stop $(docker ps -qa); docker rm $(docker ps -qa); docker rmi -f $(docker images -qa); docker volume rm $(docker volume ls -q); docker network rm $(docker network ls -q) 2>/dev/null`.
- Check `docker-compose.yml` for prohibited elements (`network: host`, `links`, `--link`).
- Ensure no infinite loops or background processes in scripts or Dockerfiles.
- Containers must be built from the penultimate stable version of Alpine or Debian.

## Mandatory Part
### Project Overview
The student must explain:
- How Docker and Docker Compose work.
- Differences between using Docker images with and without Docker Compose.
- Benefits of Docker compared to VMs.
- The relevance of the required directory structure.

### Simple Setup
- NGINX must be accessible only via port 443 with SSL/TLS.
- WordPress must be properly installed and configured (no installation page visible).
- Access via `https://login.42.fr` should work, while `http://login.42.fr` should not.

### Docker Basics
- One Dockerfile per service, not empty or missing.
- Dockerfiles must be written by the student (no pre-made images).
- Containers built from the penultimate stable Alpine/Debian version.
- Image names must match service names.
- Services must be set up via Docker Compose without crashes.

### Docker Network
- Use `docker-network` as verified in `docker-compose.yml` and `docker network ls`.
- Student must explain Docker network basics.

### NGINX with SSL/TLS
- Dockerfile must exist.
- Container must be created and accessible only via HTTPS.
- TLS v1.2/v1.3 certificate required (self-signed acceptable).

### WordPress with php-fpm and Volume
- Dockerfile must exist (no NGINX).
- Container must be created.
- Volume must exist and map to `/home/login/data` (login is student's login).
- Must be able to add comments and edit pages via WordPress admin (admin username must not include "admin").

### MariaDB and Volume
- Dockerfile must exist (no NGINX).
- Container must be created.
- Volume must exist and map to `/home/login/data`.
- Student must explain how to log into the database and verify it is not empty.

### Persistence
- Reboot the VM, restart Docker Compose, and verify functionality and data persistence.

## Bonus
- Evaluate only if the mandatory part is perfect.
- Add 1 point per authorized bonus service.
- Test each extra service and its implementation.
- For free-choice services, the student must explain its usefulness and functionality.
- Rate bonuses from 0 (failed) to 5 (excellent).

## Ratings
- Use flags for defense status: Ok, Outstanding, Empty work, Incomplete, Cheating, Crash, Concern, or Can’t support/explain code.

## Conclusion
- Leave a comment (max 2048 characters).

---
*Note: This summary retains all essential evaluation steps and criteria without omitting critical details.*