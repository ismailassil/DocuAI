# Summary: Spring Boot Book Table of Contents

This document outlines the structure of a comprehensive guide to Spring Boot development, covering foundational concepts through advanced topics.

## Chapters Overview

### 1. Spring Boot in a Nutshell
- Introduces Spring Boot’s three foundational features:
  - Starters for simplified dependency management
  - Executable JARs for simplified deployment
  - Autoconfiguration

### 2. Choosing Your Tools and Getting Started
- Compares build tools: Maven vs. Gradle
- Compares programming languages: Java vs. Kotlin
- Guides on selecting Spring Boot versions and using Spring Initializr
- Covers setup via command line, IDEs, and main() method

### 3. Creating Your First Spring Boot REST API
- Explains REST principles and HTTP verbs
- Walks through building a REST API with:
  - GET, POST, PUT, DELETE operations
  - Use of `@RestController`
- Includes verification techniques

### 4. Adding Database Access to Your Spring Boot App
- Covers autoconfiguration for databases
- Steps for adding database dependencies and writing data access code
- Includes saving, retrieving, and polishing data operations

### 5. Configuring and Inspecting Your Spring Boot App
- Details application configuration using `@Value` and `@ConfigurationProperties`
- Discusses autoconfiguration reports and Spring Boot Actuator
- Explores environment awareness and logging enhancements

### 6. Really Digging into Data
- Covers data access with various technologies:
  - Template and repository support
  - Redis, JPA (with MySQL), MongoDB, Neo4j
- Includes project initialization and data loading

### 7. Creating Applications Using Spring MVC
- Introduces Spring MVC and template engines for end-user interactions
- Covers message passing and WebSocket for real-time communication

### 8. Reactive Programming with Project Reactor and Spring WebFlux
- Introduces reactive programming concepts
- Covers Project Reactor, reactive data access (R2DBC), and Thymeleaf
- Explores RSocket for reactive interprocess communication

### 9. Testing Spring Boot Applications
- Focuses on unit testing with `@SpringBootTest`
- Includes testing slices and refactoring for testability

### 10. Securing Your Spring Boot Application
- Covers authentication and authorization with Spring Security
- Implements forms-based auth and OpenID Connect/OAuth2
- Includes practical examples with client and resource server setups

### 11. Deploying Your Spring Boot Application
- Revisits executable JARs and creating fully executable JARs
- Covers containerization: building images from IDE and command line
- Introduces utilities for examining container images (Pack, Dive)

### 12. Going Deeper with Reactive
- Discusses when to use reactive programming
- Covers testing, debugging, and diagnostics for reactive applications
- Includes refactoring examples and tools like ReactorDebugAgent

## Additional Sections
- Preface
- Index

This guide provides a structured path from Spring Boot basics to advanced production-ready application development, including security, deployment, and reactive programming.