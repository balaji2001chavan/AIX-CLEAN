export function buildGitHubApplyPlan(plan, change) {
  return {
    commitMessage: `AIX: ${plan.summary}`,
    files: change.changes.map(c => ({
      file: c.file,
      action: c.action,
      snippet: c.snippet
    })),
    instructions: [
      "1. Create new branch: aix-auto-change",
      "2. Apply changes file-wise",
      "3. Commit with above message",
      "4. Create Pull Request",
      "5. Test on Render / Frontend"
    ],
    note: "हा plan GitHub वर manually किंवा semi-auto apply करता येईल"
  };
}
