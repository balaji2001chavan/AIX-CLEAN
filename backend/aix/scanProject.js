import fs from "fs";

export function scanProject() {
  const backend = fs.readdirSync("./");
  const frontend = fs.readdirSync("../boss-aix-ui/app");

  return {
    backend,
    frontend
  };
}