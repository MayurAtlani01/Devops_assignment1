import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const MAX_OUTPUT_BYTES = 1024 * 1024;

export function runCpp({ dir, code, input, timeoutMs = 5000 }) {
  return new Promise((resolve) => {
    const isWin = process.platform === "win32";
    const binaryName = isWin ? "main.exe" : "main";
    const cppPath = path.join(dir, "main.cpp");
    const inputPath = path.join(dir, "input.txt");
    const binaryPath = path.join(dir, binaryName);

    fs.writeFileSync(cppPath, code || "");
    fs.writeFileSync(inputPath, input || "");

    const compileStart = Date.now();
    let compileStderr = "";

    const compiler = spawn("g++", ["-O2", "main.cpp", "-o", binaryName], {
      cwd: dir,
      stdio: ["ignore", "pipe", "pipe"],
    });

    compiler.stderr.on("data", (chunk) => {
      compileStderr += chunk.toString();
    });

    compiler.on("error", (err) => {
      const end = Date.now();
      resolve({
        success: false,
        compilationError: true,
        stdout: "",
        stderr: `Failed to invoke g++: ${err.message}`,
        executionTime: `${end - compileStart} ms`,
        exitCode: null,
      });
    });

    compiler.on("close", (compileCode) => {
      if (compileCode !== 0) {
        const compileEnd = Date.now();
        return resolve({
          success: false,
          compilationError: true,
          stdout: "",
          stderr: compileStderr.trim() || "Compilation failed",
          executionTime: `${compileEnd - compileStart} ms`,
          exitCode: compileCode,
        });
      }

      const execStart = Date.now();
      let stdout = "";
      let stderr = "";
      let timedOut = false;

      const executable = isWin ? binaryPath : `./${binaryName}`;
      const child = spawn(executable, [], {
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
          executionTime: `${end - execStart} ms`,
          exitCode: null,
        });
      });

      child.on("close", (runCode, signal) => {
        clearTimeout(timer);
        const end = Date.now();

        if (timedOut || signal === "SIGTERM" || signal === "SIGKILL") {
          return resolve({
            success: false,
            timedOut: true,
            stdout,
            stderr: `Execution timed out after ${timeoutMs} ms`,
            executionTime: `${end - execStart} ms`,
            exitCode: runCode,
          });
        }

        resolve({
          success: runCode === 0,
          timedOut: false,
          stdout,
          stderr,
          executionTime: `${end - execStart} ms`,
          exitCode: runCode,
        });
      });
    });
  });
}
