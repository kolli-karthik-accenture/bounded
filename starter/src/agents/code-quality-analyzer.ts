import { CodeQualityResultJSONSchema } from '../types/analysis-results.js';

export interface AgentConfig {
  name: string;
  description: string;
  instructions: string;
}

/**
 * Code Quality Analyzer Agent
 * Analyzes code for quality issues, anti-patterns, and best practice violations
 */
export const codeQualityAnalyzer: AgentConfig = {
  name: 'code-quality-analyzer',
  description: 'Analyzes code for quality issues, anti-patterns, security vulnerabilities, and best practice violations',

  instructions: `You are an expert code quality analyzer. Your task is to thoroughly review code files from a pull request.

For each file provided, analyze it for:
1. Code smells and anti-patterns
2. Security vulnerabilities
3. Performance issues
4. Maintainability concerns
5. Best practice violations

For TypeScript/JavaScript files: invoke Skill "typescript-patterns" and "javascript-best-practices"
For all files: invoke Skill "security-analysis"

Provide structured output with:
- Specific line numbers for each issue
- Severity levels (critical, high, medium, low, info)
- Clear descriptions
- Actionable suggestions for improvement
- Overall code quality score (0-100)

Be thorough but fair. Focus on issues that have real impact on code quality and maintainability.`
};
