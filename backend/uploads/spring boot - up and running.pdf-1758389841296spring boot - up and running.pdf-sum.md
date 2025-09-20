# Summary: Spring Boot Book Table of Contents

This document outlines the structure of a comprehensive guide to Spring Boot development, covering foundational concepts, practical implementation, and advanced topics.

## Chapters Overview

### 1. Spring Boot in a Nutshell
- Introduces Spring Boot's three core features:
  - Starters for simplified dependency management
  - Executable JARs for simplified deployment
  - Autoconfiguration

### 2. Choosing Your Tools and Getting Started
- Compares build tools: Maven vs. Gradle
- Discusses language options: Java vs. Kotlin
- Guides on selecting Spring Boot version
- Covers project initialization via Spring Initializr, command line, and IDEs

### 3. Creating Your First Spring Boot REST API
- Explains REST principles and HTTP verbs
- Demonstrates building a REST API with:
  - GET, POST, PUT, DELETE operations
  - @RestController usage
  - Domain creation and verification

### 4. Adding Database Access to Your Spring Boot App
- Covers database autoconfiguration
- Steps for adding database dependencies and code
- Data saving/retrieval and application polishing

### 5. Configuring and Inspecting Your Spring Boot App
- Details application configuration using:
  - @Value annotation
  - @ConfigurationProperties
- Explores autoconfiguration reports and Spring Boot Actuator
- Covers logging and environmental awareness

### 6. Really Digging into Data
- Comprehensive data access coverage:
  - Entity definition
  - Template and repository support
  - Multiple database implementations:
    - Redis (template-based)
    - JPA with MySQL
    - MongoDB (NoSQL document database)
    - Neo4j (NoSQL graph database)

### 7. Creating Applications Using Spring MVC
- Explains Spring MVC framework
- Covers template engines for end-user interactions
- Implements message passing and WebSocket communications
- Includes practical aircraft positions application example

### 8. Reactive Programming with Project Reactor and Spring WebFlux
- Introduction to reactive programming concepts
- Covers Project Reactor, Tomcat vs Netty comparison
- Reactive data access with R2DBC and H2
- Reactive Thymeleaf and RSocket for interprocess communication

### 9. Testing Spring Boot Applications
- Unit testing with @SpringBootTest
- Testing strategies for aircraft positions application
- Refactoring for better testability
- Testing slices methodology

### 10. Securing Your Spring Boot Application
- Covers authentication and authorization concepts
- Spring Security implementation:
  - Forms-based authentication
  - OpenID Connect and OAuth2
  - HTTP firewall and security filter chains

### 11. Deploying Your Spring Boot Application
- Executable JAR deployment
- Containerization strategies:
  - Creating container images from IDE and command line
  - Container verification and utilities (Pack, Dive)
- Exploding JARs for deployment

### 12. Going Deeper with Reactive
- Advanced reactive programming topics:
  - When to use reactive approach
  - Testing reactive applications
  - Debugging and diagnostics with Hooks.onOperatorDebug() and checkpoints

## Additional Elements
- Preface
- Index
- Comprehensive coverage from basics to production-ready deployment
- Practical examples throughout including aircraft positioning application
- Multiple database and security implementation strategies