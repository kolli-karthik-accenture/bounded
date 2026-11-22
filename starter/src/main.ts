import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Main entry point for the Claude Multi-Agent Code Review System
 * Usage: npm run dev <owner> <repo> <pr-number>
 */
async function main() {
  const [owner, repo, prStr] = process.argv.slice(2);

  // TODO: Validate command line arguments
  // - Check if owner, repo, and prStr are provided
  // - Convert prStr to number and validate it's a valid integer
  // - Exit with error message if validation fails

  if (!owner || !repo || !prStr) {
    console.error('❌ Missing required arguments');
    console.error('Usage: npm run dev <owner> <repo> <pr-number>');
    process.exit(1);
  }

  const prNumber = parseInt(prStr, 10);
  if (isNaN(prNumber) || prNumber <= 0) {
    console.error('❌ PR number must be a valid positive integer');
    process.exit(1);
  }

  // TODO: Validate authentication (choose ONE method)
  // Students must have either:
  //   - ANTHROPIC_API_KEY environment variable, OR
  //   - AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY for Bedrock
  //
  // If using AWS Bedrock:
  //   - Verify AWS_REGION is set
  //   - Log: "🔐 Using AWS Bedrock authentication"
  // If using Anthropic API:
  //   - Log: "🔐 Using Anthropic API authentication"
  // If neither method is configured:
  //   - Exit with clear error message showing both options

  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
  const hasAwsCredentials =
    !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY;

  if (!hasAnthropicKey && !hasAwsCredentials) {
    console.error('❌ No authentication configured');
    console.error(
      'Please set either:\n' +
      '  Option 1: ANTHROPIC_API_KEY environment variable\n' +
      '  Option 2: AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY (requires AWS_REGION)'
    );
    process.exit(1);
  }

  if (hasAwsCredentials) {
    const hasAwsRegion = !!process.env.AWS_REGION;
    if (!hasAwsRegion) {
      console.error('❌ AWS_REGION is required for AWS Bedrock authentication');
      process.exit(1);
    }
    console.log('🔐 Using AWS Bedrock authentication');
  } else {
    console.log('🔐 Using Anthropic API authentication');
  }

  // TODO: Validate ANTHROPIC_MODEL environment variable
  // This is REQUIRED for both authentication methods
  // - For AWS Bedrock: us.anthropic.claude-sonnet-4-5-20250929-v1:0
  // - For Anthropic API: claude-sonnet-4-5-20250929
  // Exit with error if not set

  if (!process.env.ANTHROPIC_MODEL) {
    console.error('❌ ANTHROPIC_MODEL environment variable is required');
    console.error(
      'Set ANTHROPIC_MODEL to:\n' +
      '  - For AWS Bedrock: us.anthropic.claude-sonnet-4-5-20250929-v1:0\n' +
      '  - For Anthropic API: claude-sonnet-4-5-20250929'
    );
    process.exit(1);
  }

  console.log(`📋 Reviewing PR: ${owner}/${repo}#${prNumber}`);
  try {
    // TODO: Create orchestrator instance
    // TODO: Call .reviewPullRequest(owner, repo, prNumber);
    // TODO: Generate formatted reports using ReportGenerator
    // Hint: Use ReportGenerator to create Markdown, HTML, and JSON reports
    // Save reports to 'reports/' directory with appropriate filenames

    const { CodeReviewOrchestrator } = await import('./orchestrator.js');
    const { ReportGenerator } = await import('./utils/index.js');

    const orchestrator = new CodeReviewOrchestrator();
    const report = await orchestrator.reviewPullRequest(owner, repo, prNumber);

    const reportGenerator = new ReportGenerator();
    const markdownReport = reportGenerator.generateMarkdownReport(report);
    const htmlReport = reportGenerator.generateHTMLReport(report);
    const jsonReport = reportGenerator.generateJSONReport(report);

    // Save reports to 'reports/' directory
    const fs = await import('fs/promises');
    const path = await import('path');

    const reportsDir = path.default.resolve('reports');
    await fs.mkdir(reportsDir, { recursive: true });

    const baseName = `${owner}-${repo}-pr-${prNumber}`;
    await fs.writeFile(path.default.join(reportsDir, `${baseName}.md`), markdownReport);
    await fs.writeFile(path.default.join(reportsDir, `${baseName}.html`), htmlReport);
    await fs.writeFile(path.default.join(reportsDir, `${baseName}.json`), jsonReport);

    console.log(`✅ Review complete! Reports saved to reports/ directory`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
