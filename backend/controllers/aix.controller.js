// DEPRECATED AIX CONTROLLER
// This file is intentionally disabled

export function aixCommand(req, res) {
  return res.json({
    success: false,
    message: "This controller is deprecated. Use /api/aix or /api/aix-apx."
  });
}
