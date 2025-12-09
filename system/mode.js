export let MODE = "CONTROLLED"; // CONTROLLED | AGI | HYBRID

export function setMode(newMode) {
  if (["CONTROLLED", "AGI", "HYBRID"].includes(newMode)) {
    MODE = newMode;
    return { status: "ok", mode: MODE };
  }
  return { status: "error", message: "Invalid mode" };
}
