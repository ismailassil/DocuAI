# Summary: Spring Boot Book Table of Contents

## Overview
This document presents the table of contents for a comprehensive guide on Spring Boot, covering foundational concepts, practical development, and advanced topics.

## Chapters

### 1. Spring Boot in a Nutshell
- Introduces Spring Boot's three core features:
  - Starters for simplified dependency management
  - Executable JARs for simplified deployment
  - Autoconfiguration

### 2. Choosing Your Tools and Getting Started
- Compares build tools: Maven vs. Gradle
- Discusses language options: Java vs. Kotlin
- Guides on selecting Spring Boot versions
- Covers project initialization via:
  - Spring Initializr
  - Command line
  - IDEs
  - Direct `main()` method usage

### 3. Creating Your First Spring Boot REST API
- Explains APIs and REST principles
- Demonstrates HTTP verbs (GET, POST, PUT, DELETE)
- Covers `@RestController` and verification techniques

### 4. Adding Database Access to Your Spring Boot App
- Details autoconfiguration for databases
- Steps for adding database dependencies and code
- Covers data saving, retrieval, and polishing

### 5. Configuring and Inspecting Your Spring Boot App
- Explores application configuration using `@Value` and `@ConfigurationProperties`
- Discusses third-party options
- Introduces autoconfiguration reports and Actuator for monitoring and logging

### 6. Really Digging into Data
- Covers entity definition and data access patterns:
  - Template support (Redis)
  - Repository support (JPA with MySQL, MongoDB, Neo4j)
- Includes project initialization and data loading

### 7. Creating Applications Using Spring MVC
- Explains Spring MVC and template engines for user interactions
- Covers message passing and WebSocket for real-time communication

### 8. Reactive Programming with Project Reactor and Spring WebFlux
- Introduces reactive programming concepts
- Compares Tomcat and Netty
- Covers reactive data access (R2DBC with H2), Thymeleaf, and RSocket

### 9. Testing Spring Boot Applications
- Focuses on unit testing with `@SpringBootTest`
- Includes testing slices and refactoring for testability

### 10. Securing Your Spring Boot Application
- Discusses authentication and authorization
- Covers Spring Security fundamentals
- Implements forms-based auth and OpenID Connect/OAuth2

### 11. Deploying Your Spring Boot Application
- Revisits executable JARs and "fully executable" options
- Covers container deployment (Docker) and image verification tools (Pack, Dive)

### 12. Going Deeper with Reactive
- Discusses when to use reactive programming
- Covers testing, refactoring, debugging, and diagnostics for reactive apps

## Additional Sections
- Preface
- Index

This structured guide progresses from basics to advanced topics, providing a thorough pathway for learning and applying Spring Boot in various contexts.