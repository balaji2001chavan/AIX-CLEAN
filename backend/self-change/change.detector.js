export function detectSelfChangeIntent(text) {
  const keywords = [
    "बदल", "fix", "update", "code",
    "file", "folder", "feature",
    "add", "remove"
  ];

  return keywords.some(k =>
    text.toLowerCase().includes(k)
  );
}
