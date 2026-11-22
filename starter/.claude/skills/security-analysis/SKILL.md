---
description: Identifies security vulnerabilities, OWASP risks, and secure coding best practices
---

# Security Analysis Expert

Expert in OWASP Top 10, common security vulnerabilities, and defensive coding practices.

## OWASP Top 10 Vulnerabilities

**A01: Broken Access Control**
- Missing authentication checks
- Insufficient authorization validation
- Privilege escalation vulnerabilities
- Exposed sensitive endpoints

**A02: Cryptographic Failures**
- Storing passwords in plain text
- Using weak encryption algorithms
- Not using HTTPS/TLS
- Hardcoded secrets in code

**A03: Injection**
- SQL Injection from unsanitized user input
- Command injection via shell execution
- NoSQL injection attacks
- Template injection vulnerabilities

**A04: Insecure Design**
- Missing security requirements
- No threat modeling
- Inadequate input validation
- Weak authentication mechanisms

**A05: Security Misconfiguration**
- Insecure default configurations
- Unnecessary services enabled
- Missing security headers
- Outdated dependencies with known CVEs

**A06: Vulnerable Components**
- Using outdated libraries with CVEs
- Dependencies without security updates
- Transitive dependency vulnerabilities

**A07: Authentication Failures**
- Weak password validation
- Missing Multi-Factor Authentication (MFA)
- Session management issues
- Improper credential handling

**A08: Software & Data Integrity Failures**
- Unsafe deserialization
- Insecure CI/CD pipelines
- Unsigned updates

**A09: Logging & Monitoring Failures**
- Not logging security events
- Insufficient audit trails
- Missing detection mechanisms

**A10: Server-Side Request Forgery (SSRF)**
- Unchecked URL/hostname parameters
- Internal network access via user input

## Secure Coding Practices

- **Input Validation**: Always validate and sanitize user input
- **Output Encoding**: Escape output based on context (HTML, URL, SQL, etc.)
- **Principle of Least Privilege**: Grant minimum necessary permissions
- **Defense in Depth**: Multiple security layers
- **Secure Defaults**: Safe-by-default configurations
- **Fail Securely**: Errors should not expose sensitive information
- **Don't Trust External Input**: Validate all external data

## Common Security Mistakes

- Storing sensitive data in logs or error messages
- Using regular expressions for validation (ReDoS vulnerability)
- Inadequate error handling revealing stack traces
- Hardcoded API keys or passwords
- Missing rate limiting (DoS vulnerability)
- No CORS validation on API endpoints
- Unsafe use of `eval()` or `Function()` constructors
- Not validating redirects (open redirect vulnerability)
- Weak random number generation for security tokens
- Missing Content Security Policy (CSP) headers

## API Security

- Implement proper authentication (OAuth2, JWT, API keys)
- Use HTTPS/TLS for all communications
- Validate API request sizes and rates
- Implement proper CORS policies
- Use short-lived tokens with refresh mechanisms
- Validate token signatures and expiration
- Implement request signing for sensitive operations

## Data Protection

- Encrypt sensitive data at rest and in transit
- Use strong hashing algorithms for passwords (bcrypt, argon2)
- Implement key rotation strategies
- Proper data retention and deletion policies
- PII handling and compliance (GDPR, HIPAA)

## Output:

For each security issue provide:
1. Vulnerability description
2. OWASP category and risk level
3. Exploitation scenario
4. Secure code example
5. Recommended fixes
6. Compliance implications
