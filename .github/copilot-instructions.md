# Smart Dependency Analyzer (SDA) - GitHub Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a world-class Smart Dependency Analyzer built with enterprise-grade architecture and practices. We're building the most sophisticated dependency analysis tool ever created, focused on security, performance, and developer experience.

## Code Quality Standards

- **TypeScript Strict Mode**: All code must use strict TypeScript with comprehensive type safety
- **100% Test Coverage**: Every function, class, and module must have complete test coverage
- **Performance First**: Sub-100ms response times for all core operations
- **Security by Design**: Zero-trust security model with comprehensive validation
- **Enterprise Scale**: Handle 10,000+ packages and unlimited concurrent users

## Architecture Principles

- **Domain-Driven Design**: Clear separation between business logic and infrastructure
- **Dependency Injection**: Use IoC containers for all service dependencies
- **Factory Pattern**: For complex object creation and configuration
- **Repository Pattern**: For all data access operations
- **Command/Query Separation**: Separate read and write operations

## Development Guidelines

### Code Style
- Use meaningful, descriptive variable and function names
- Prefer composition over inheritance
- Keep functions small and focused (single responsibility)
- Use async/await over Promises for better readability
- Always handle errors gracefully with proper logging

### Testing Requirements
- Unit tests for all business logic
- Integration tests for API endpoints and database operations
- Performance tests for critical paths
- Security tests for all user inputs
- Mock external dependencies in tests

### Security Requirements
- Validate all inputs with schema validation
- Sanitize all outputs to prevent injection attacks
- Use parameterized queries for all database operations
- Implement rate limiting on all public endpoints
- Log all security-relevant operations

### Performance Requirements
- Use streaming for large data processing
- Implement intelligent caching strategies
- Optimize database queries with proper indexing
- Use connection pooling for external services
- Monitor memory usage and prevent leaks

## Project Structure

```
src/
├── core/           # Business logic and domain models
├── analyzers/      # Specialized analysis engines
├── intelligence/   # AI/ML models and algorithms
├── integrations/   # External API clients
├── cli/           # Command-line interface
├── api/           # REST/GraphQL API layer
├── utils/         # Shared utilities and helpers
├── types/         # TypeScript type definitions
└── config/        # Configuration management
```

## Naming Conventions

- **Classes**: PascalCase with descriptive names (e.g., `VulnerabilityScanner`)
- **Interfaces**: PascalCase starting with 'I' (e.g., `IAnalysisEngine`)
- **Functions**: camelCase with verb-noun pattern (e.g., `analyzePackage`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_PACKAGE_SIZE`)
- **Files**: kebab-case for modules, PascalCase for classes

## Error Handling

- Use custom error classes extending the base Error class
- Include context and actionable information in error messages
- Implement proper error logging with structured data
- Never expose internal errors to end users
- Always provide fallback behavior when possible

## Documentation Requirements

- JSDoc comments for all public APIs
- Include examples in documentation
- Document complex algorithms and business logic
- Maintain up-to-date README files
- Create architectural decision records (ADRs) for major decisions

## External Integrations

- **GitHub API**: For repository analysis and security advisories
- **npm Registry**: For package metadata and vulnerability data
- **Security Databases**: Snyk, OSV, NVD for vulnerability intelligence
- **AI/ML Services**: For predictive analytics and natural language processing

## Performance Targets

- Package analysis: < 100ms
- Vulnerability scanning: < 500ms
- Report generation: < 2 seconds
- API response times: < 100ms
- Memory usage: < 1GB for standard operations

## Quality Gates

All code must pass:
- ESLint with zero warnings
- Prettier code formatting
- TypeScript strict compilation
- Jest tests with 100% coverage
- Security scanning with zero high/critical issues
- Performance benchmarks within targets

Remember: We're building the future of dependency analysis. Every line of code should reflect enterprise-grade quality and attention to detail.
