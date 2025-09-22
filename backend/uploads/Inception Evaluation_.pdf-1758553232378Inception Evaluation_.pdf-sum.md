# Summary: Project Inception Evaluation Guidelines

## Overview
This document outlines the evaluation process for the **Inception** project at 42 School, focusing on Docker-based infrastructure setup. The evaluation must be conducted respectfully and constructively, ensuring adherence to project requirements and academic integrity.

## Key Guidelines
- **Politeness and Respect**: Evaluators must maintain a courteous and constructive tone.
- **Focus on Git Repository**: Only the submitted Git repository should be graded.
- **Verification**: Confirm the repository belongs to the correct student(s) and contains no malicious aliases.
- **Cheating**: Suspected cheating ends the evaluation immediately with a grade of -42.
- **Defense Requirement**: The evaluated student must be present for the defense.

## Preliminary Checks
- Ensure no credentials or sensitive data are exposed in the repository.
- Verify the repository structure includes a `srcs` folder and a `Makefile` at the root.
- Run cleanup commands to reset Docker environments before evaluation.
- Check `docker-compose.yml` for prohibited configurations (e.g., `network: host`, `links`).

## Mandatory Requirements
### Docker Basics
- Each service must have its own Dockerfile.
- Containers must be built from the penultimate stable version of Alpine or Debian.
- Images must match service names.
- The `Makefile` must set up services via Docker Compose.

### Network and Services
- **Docker Network**: Must be configured and explained by the student.
- **NGINX with SSL/TLS**:
  - Accessible only via port 443.
  - Must use a TLS v1.2/v1.3 certificate (self-signed allowed).
  - WordPress must be accessible via HTTPS, not HTTP.
- **WordPress with php-fpm**:
  - Must use a volume for persistence.
  - Admin username must not include "admin" or variations.
- **MariaDB**:
  - Must use a volume for data persistence.
  - Student must explain database login procedures.

### Persistence Test
- After rebooting the VM, services must restart correctly, and WordPress changes must persist.

## Bonus Criteria
- Bonus points are only awarded if the mandatory part is perfectly completed.
- Each bonus service must be tested and explained by the student.
- Ratings range from 0 (failed) to 5 (excellent).

## Evaluation Flags
Flags include:
- ✅ Ok
- 🏆 Outstanding project
- ⚠️ Empty/incomplete work
- 🚫 Cheating
- 💥 Crash
- ❓ Cannot support/explain code

## Conclusion
Evaluators must leave a comment (max 2048 characters) summarizing their findings.