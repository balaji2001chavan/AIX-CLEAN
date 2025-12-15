if (decision.mode === "ACT") {
  const mem = getMemory();
  if (mem.lastTopic === "knowledge") {
    const info = await getLiveKnowledge("ai");
    setMemory({ lastTopic: null });
    return res.json({
      reply: wrapReply({
        message: `${info}\n\nहे general आहे बॉस. specific verify करायचं असेल तर सांगा.`
      })
    });
  }
}
