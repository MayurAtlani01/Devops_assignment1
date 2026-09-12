import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const MAX_OUTPUT_BYTES = 1024 * 1024;

export function runJavaScript({ dir, code, input, timeoutMs = 5000 }) {
  return new Promise((resolve) => {
    const codePath = path.join(dir, "code.js");
    const inputPath = path.join(dir, "input.txt");

    fs.writeFileSync(codePath, code || "");
    fs.writeFileSync(inputPath, input || "");

    const start = Date.now();
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const child = spawn("node", ["code.js"], {
      cwd: dir,
      stdio: ["pipe", "pipe", "pipe"],
    });

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    if (input) {
      child.stdin.write(input);
    }
    child.stdin.end();

    child.stdout.on("data", (chunk) => {
      if (stdout.length < MAX_OUTPUT_BYTES) {
        stdout += chunk.toString();
      }
    });

    child.stderr.on("data", (chunk) => {
      if (stderr.length < MAX_OUTPUT_BYTES) {
        stderr += chunk.toString();
      }
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      const end = Date.now();
      resolve({
        success: false,
        timedOut: false,
        stdout,
        stderr: err.message,
        executionTime: `${end - start} ms`,
        exitCode: null,
      });
    });

    child.on("close", (code, signal) => {
      clearTimeout(timer);
      const end = Date.now();

      if (timedOut || signal === "SIGTERM" || signal === "SIGKILL") {
        return resolve({
          success: false,
          timedOut: true,
          stdout,
          stderr: `Execution timed out after ${timeoutMs} ms`,
          executionTime: `${end - start} ms`,
          exitCode: code,
        });
      }

      resolve({
        success: code === 0,
        timedOut: false,
        stdout,
        stderr,
        executionTime: `${end - start} ms`,
        exitCode: code,
      });
    });
  });
}
