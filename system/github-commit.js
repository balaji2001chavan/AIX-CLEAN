import fetch from "node-fetch";

export async function githubCommit({
  token,
  repo,
  filePath,
  content,
  mode = "NORMAL", // NORMAL | AI | HIDDEN | TIME | HYBRID
  message = "Auto Update by BOSS AIX"
}) {

  const encodedContent = Buffer.from(content).toString("base64");

  let commitMessage = message;

  if (mode === "AI") {
    commitMessage = "♟ Autonomous AI Update (BOSS AIX)";
  }

  if (mode === "HIDDEN") {
    commitMessage = "\u2063"; // invisible unicode commit
  }

  if (mode === "TIME") {
    commitMessage = `⏳ Time-based Update: ${new Date().toISOString()}`;
  }

  if (mode === "HYBRID") {
    commitMessage = `⚡ Hybrid Update: System Optimization ${Date.now()}`;
  }

  const response = await fetch(
    `https://api.github.com/repos/${repo}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        "Authorization": `token ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: commitMessage,
        content: encodedContent
      })
    }
  );

  return response.json();
}
