import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readExecutionProfile } from "./execution-profile.mjs";

const cwd = fileURLToPath(new URL("../", import.meta.url));
const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  return result;
};

if (readExecutionProfile() === "managed-linux") {
  run("bash", [fileURLToPath(new URL("./install-pnpm.sh", import.meta.url))]);
} else {
  // Preserve the host environment and the existing pnpm lockfile on local machines.
  const options = { shell: process.platform === "win32" };
  const expected = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"))
    .packageManager.split("@")[1];
  const version = run("pnpm", ["--version"], { ...options, stdio: "pipe" });
  if (version.stdout.toString().trim() !== expected) {
    throw new Error(`This project requires pnpm ${expected}.`);
  }
  run("pnpm", ["install", "--frozen-lockfile", "--prefer-offline", "--prod=false"], options);
}
