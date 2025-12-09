setInterval(async () => {
  try {
    const task = await getPendingTask();
    if (task) {
      const result = await runAIX(task.command);
      await saveResult(task.id, result);
    }
  } catch (err) {
    console.log("[AIX AUTO] Self-healing…");
  }
}, 5000);