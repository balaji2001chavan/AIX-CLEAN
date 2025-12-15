// ===== CODE ANALYSIS (NO EXECUTION) =====
if (
  lower.includes("प्रोजेक्ट तपास") ||
  lower.includes("code analysis") ||
  lower.includes("काय बदल")
) {
  const report = analyzeProject();

  return res.json({
    reply:
      "बॉस, मी पूर्ण प्रोजेक्ट तपासला आहे.\n" +
      "काय योग्य आहे, काय सुधारता येईल ते खाली सांगतो.\n" +
      "पुढे बदल सुचवू का?",
    analysis: {
      summary: report.summary,
      insights: report.insights
    }
  });
}
