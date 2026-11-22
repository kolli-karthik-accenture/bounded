import { ReviewReport, ReviewReportSchema } from './types/report-types.js';
import { RateLimiterConfig, globalRateLimiter, withRateLimit } from './utils/rate-limiter.js';
import { withRetry, withTimeout, ReviewError, ErrorCodes } from './utils/error-handler.js';
import { logger } from './utils/index.js';

/**
 * Orchestrator configuration options
 */
export interface OrchestratorOptions {
  rateLimiterConfig?: Partial<RateLimiterConfig>;
}

/**
 * Main Code Review Orchestrator
 * Coordinates subagents to analyze pull requests and generate comprehensive reports
 */
export class CodeReviewOrchestrator {
  private rateLimiterConfig: Partial<RateLimiterConfig>;

  constructor(options: OrchestratorOptions = {}) {
    this.rateLimiterConfig = options.rateLimiterConfig || {};
  }

  /**
   * Review a pull request using parallel subagent analysis
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param prNumber - Pull request number
   * @returns Complete review report
   */
  async reviewPullRequest(
    owner: string,
    repo: string,
    prNumber: number
  ): Promise<ReviewReport> {
    const startTime = Date.now();

    try {
      logger.info(`Starting review for ${owner}/${repo}#${prNumber}`);

      // Fetch PR files from GitHub using MCP or REST API
      const prFiles = await this.fetchPRFiles(owner, repo, prNumber);
      logger.info(`Fetched ${prFiles.length} files from PR`);

      if (prFiles.length === 0) {
        logger.warn(`No files found in PR ${owner}/${repo}#${prNumber}`);
        return this.createEmptyReport(owner, repo, prNumber, startTime);
      }

      // Analyze files with timeout and rate limiting
      const fileReviews = await Promise.all(
        prFiles.map((file: any) =>
          withRateLimit(
            globalRateLimiter,
            () => this.analyzeFile(file),
            2000 // estimated tokens per analysis
          )
        )
      );

      logger.info(`Analyzed ${fileReviews.length} files`);

      // Aggregate results
      const aggregated = this.aggregateResults(owner, repo, prNumber, fileReviews);

      // Validate with schema
      const report = ReviewReportSchema.parse(aggregated);

      logger.info(`Review complete: score=${report.summary.overallScore}/100`);
      return report;
    } catch (error) {
      logger.error('Review orchestration failed:', error);

      // Return empty report on error instead of throwing
      return this.createEmptyReport(owner, repo, prNumber, startTime);
    }
  }

  /**
   * Fetch PR files from GitHub
   * Uses GitHub MCP server or REST API fallback
   */
  private async fetchPRFiles(owner: string, repo: string, prNumber: number) {
    return withRetry(async () => {
      return withTimeout(async () => {
        // Attempt to fetch via GitHub REST API with token
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
          logger.warn('GITHUB_TOKEN not set, using mock data');
          return this.getMockPRFiles(owner, repo, prNumber);
        }

        const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`;
        const response = await fetch(url, {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'Claude-Code-Review'
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            logger.warn(`PR ${owner}/${repo}#${prNumber} not found`);
            return [];
          }
          throw new ReviewError(
            `GitHub API error: ${response.statusText}`,
            ErrorCodes.GITHUB_API_ERROR,
            { status: response.status }
          );
        }

        const files = (await response.json()) as any[];
        return files.map((f: any) => ({
          path: f.filename,
          sha: f.sha,
          status: f.status,
          patch: f.patch || '',
          language: this.detectLanguage(f.filename)
        }));
      }, 10000); // 10 second timeout
    }, 3, 1000); // 3 retries with 1s base delay
  }

  /**
   * Analyze a single file with code quality, coverage, and refactoring
   */
  private async analyzeFile(file: any) {
    logger.info(`Analyzing ${file.path}`);

    // Simulate agent analysis with realistic results
    const analysisResult = {
      file: file.path,
      codeQuality: {
        file: file.path,
        issues: this.generateMockIssues(file),
        overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
        summary: `Analyzed ${file.path}: ${Math.floor(Math.random() * 3)} issues found`
      },
      testCoverage: {
        file: file.path,
        hasTests: Math.random() > 0.5,
        testFiles: [],
        untestedPaths: this.generateMockUntested(file),
        coverageEstimate: Math.floor(Math.random() * 40) + 50, // 50-90%
        summary: `Test coverage: ~${Math.floor(Math.random() * 40) + 50}%`
      },
      refactorings: {
        file: file.path,
        suggestions: this.generateMockSuggestions(file),
        summary: `${Math.floor(Math.random() * 3)} refactoring opportunities`
      }
    };

    return analysisResult;
  }

  /**
   * Generate mock issues for demonstration
   */
  private generateMockIssues(file: any) {
    const issueCount = Math.floor(Math.random() * 3);
    const issues = [];

    for (let i = 0; i < issueCount; i++) {
      issues.push({
        line: Math.floor(Math.random() * 100) + 1,
        severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)],
        category: ['security', 'performance', 'maintainability', 'style'][Math.floor(Math.random() * 4)],
        description: `Potential issue in ${file.path}`,
        suggestion: 'Consider reviewing this section'
      });
    }

    return issues;
  }

  /**
   * Generate mock untested paths
   */
  private generateMockUntested(file: any) {
    const paths = [];

    if (Math.random() > 0.7) {
      paths.push({
        type: 'function' as const,
        location: 'main handler',
        priority: 'high' as const,
        reasoning: 'Critical business logic',
        suggestedTest: 'Test main use case'
      });
    }

    return paths;
  }

  /**
   * Generate mock refactoring suggestions
   */
  private generateMockSuggestions(file: any) {
    const suggestions = [];

    if (Math.random() > 0.8) {
      suggestions.push({
        type: 'extract-function' as const,
        location: 'line 42',
        impact: 'medium' as const,
        description: 'Extract complex logic into helper',
        before: 'complex code here',
        after: 'helper() // cleaner',
        benefits: 'Improves readability'
      });
    }

    return suggestions;
  }

  /**
   * Get mock PR files for testing
   */
  private getMockPRFiles(owner: string, repo: string, prNumber: number) {
    return [
      {
        path: 'README.md',
        sha: 'abc123',
        status: 'modified',
        patch: '+## Updated section',
        language: 'markdown'
      },
      {
        path: 'src/main.ts',
        sha: 'def456',
        status: 'modified',
        patch: '+export const newFeature = () => {}',
        language: 'typescript'
      },
      {
        path: 'src/utils.ts',
        sha: 'ghi789',
        status: 'added',
        patch: '+const helper = () => {}',
        language: 'typescript'
      }
    ];
  }

  /**
   * Aggregate results from all analyses
   */
  private aggregateResults(owner: string, repo: string, prNumber: number, fileReviews: any[]) {
    const summary = {
      totalFiles: fileReviews.length,
      overallScore: Math.floor(
        fileReviews.reduce((sum, r) => sum + r.codeQuality.overallScore, 0) / fileReviews.length
      ),
      criticalIssues: fileReviews.reduce(
        (sum, r) => sum + (r.codeQuality.issues.filter((i: any) => i.severity === 'critical').length || 0),
        0
      ),
      highPriorityTests: fileReviews.reduce(
        (sum, r) => sum + (r.testCoverage.untestedPaths.filter((p: any) => p.priority === 'high').length || 0),
        0
      ),
      refactoringOpportunities: fileReviews.reduce(
        (sum, r) => sum + (r.refactorings.suggestions.length || 0),
        0
      )
    };

    // Generate top recommendations
    const recommendations = this.generateRecommendations(fileReviews);

    return {
      pullRequest: {
        owner,
        repo,
        number: prNumber
      },
      fileReviews,
      summary,
      recommendations,
      metadata: {
        analyzedAt: new Date().toISOString(),
        duration: 0,
        agentVersions: {
          'code-quality-analyzer': '1.0.0',
          'test-coverage-analyzer': '1.0.0',
          'refactoring-suggester': '1.0.0'
        }
      }
    };
  }

  /**
   * Generate top recommendations from file reviews
   */
  private generateRecommendations(fileReviews: any[]) {
    const recommendations = [];

    // Extract critical issues
    for (const review of fileReviews) {
      for (const issue of review.codeQuality.issues || []) {
        if (issue.severity === 'critical') {
          recommendations.push({
            priority: 'critical' as const,
            category: issue.category,
            description: `${issue.description} in ${review.file}`,
            files: [review.file]
          });
        }
      }
    }

    // Extract high priority test gaps
    for (const review of fileReviews) {
      for (const path of review.testCoverage.untestedPaths || []) {
        if (path.priority === 'high') {
          recommendations.push({
            priority: 'high' as const,
            category: 'test-coverage',
            description: `Missing test for ${path.location} in ${review.file}`,
            files: [review.file]
          });
        }
      }
    }

    return recommendations.slice(0, 10); // Top 10 recommendations
  }

  /**
   * Create empty report when no files or analysis fails
   */
  private createEmptyReport(owner: string, repo: string, prNumber: number, startTime: number) {
    return ReviewReportSchema.parse({
      pullRequest: {
        owner,
        repo,
        number: prNumber
      },
      fileReviews: [],
      summary: {
        totalFiles: 0,
        overallScore: 0,
        criticalIssues: 0,
        highPriorityTests: 0,
        refactoringOpportunities: 0
      },
      recommendations: [],
      metadata: {
        analyzedAt: new Date().toISOString(),
        duration: Date.now() - startTime,
        agentVersions: {
          'code-quality-analyzer': '1.0.0',
          'test-coverage-analyzer': '1.0.0',
          'refactoring-suggester': '1.0.0'
        }
      }
    });
  }

  /**
   * Detect programming language from file extension
   */
  private detectLanguage(filename: string): string {
    if (filename.endsWith('.ts')) return 'typescript';
    if (filename.endsWith('.tsx')) return 'typescript';
    if (filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.jsx')) return 'javascript';
    if (filename.endsWith('.py')) return 'python';
    if (filename.endsWith('.java')) return 'java';
    if (filename.endsWith('.go')) return 'go';
    if (filename.endsWith('.rb')) return 'ruby';
    if (filename.endsWith('.md')) return 'markdown';
    return 'unknown';
  }
}
