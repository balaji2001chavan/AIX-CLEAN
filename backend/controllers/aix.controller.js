export default {
  async chat(req, res) {
    try {
      const { message } = req.body;

      if (!message) {
        return res.json({
          reply: "काय हवं आहे बॉस? बोला. मी ऐकतोय.",
        });
      }

      // 🔮 Agentic style reply (foundation)
      const reply = `
बरं बॉस. समजलो.

तुमचं म्हणणं:
"${message}"

मी पुढे हे करू शकतो:
1) परिणाम सांगणे
2) Approval मागणे
3) रियल काम execute करणे
4) Proof दाखवणे

पुढचा आदेश द्या बॉस.
`;

      return res.json({
        reply,
        mode: "AGENTIC",
        next: "WAITING_FOR_COMMAND"
      });

    } catch (err) {
      return res.status(500).json({
        error: "AIX brain error",
        details: err.message
      });
    }
  }
};
