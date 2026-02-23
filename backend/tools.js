import { exec } from "child_process";

export function systemStatus() {
  return new Promise((resolve) => {
    exec("pm2 list", (err, stdout) => {
      resolve("🧠 AIX System Status:\n" + stdout);
    });
  });
}

export function repairSystem() {
  return new Promise((resolve) => {
    exec("pm2 restart all", () => {
      resolve("✅ AIX attempted system repair.");
    });
  });
}
