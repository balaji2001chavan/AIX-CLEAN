import fs from "fs";
import path from "path";

export function selfChangeAction({ title, plan }) {
  const baseDir = path.join(process.cwd(), "self-changes");
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir);

  const safeName =
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
    "-" +
    Date.now() +
    ".md";

  const filePath = path.join(baseDir, safeName);

  const content = `# AIX Self Change Plan

## Title
${title}

## Why this change
${plan.why}

## What will change
${plan.what}

## How it will be implemented
${plan.how}

## Expected Result
${plan.result}

## Status
Proposed by AIX. Waiting for execution approval.
`;

  fs.writeFileSync(filePath, content, "utf8");

  return {
    success: true,
    file: safeName,
    path: `/self-changes/${safeName}`
  };
}
