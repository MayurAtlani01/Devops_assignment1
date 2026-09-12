import express from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import os from "os";
import { runJavaScript } from "./handlers/javascript.js";
import { runCpp } from "./handlers/cpp.js";

const app = express();
const PORT = process.env.PORT || 5000;
const TIMEOUT_MS = parseInt(process.env.TIMEOUT_MS || "5000", 10);

app.use(express.json());

const BASE_EXEC_DIR = path.join(os.tmpdir(), "code-runner");
if (!fs.existsSync(BASE_EXEC_DIR)) {
  fs.mkdirSync(BASE_EXEC_DIR, { recursive: true });
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "code-runner" });
});

app.post("/execute", async (req, res) => {
  const { language = "javascript", code, input = "" } = req.body;

  if (typeof code !== "string") {
    return res.status(400).json({
      message: "Code must be provided as a string",
    });
  }

  const normalizedLang = language.toLowerCase().trim();
  const jobId = crypto.randomUUID();
  const jobDir = path.join(BASE_EXEC_DIR, jobId);

  try {
    fs.mkdirSync(jobDir, { recursive: true });

    let result;
    if (normalizedLang === "javascript" || normalizedLang === "js") {
      result = await runJavaScript({
        dir: jobDir,
        code,
        input,
        timeoutMs: TIMEOUT_MS,
      });
    } else if (normalizedLang === "cpp" || normalizedLang === "c++") {
      result = await runCpp({
        dir: jobDir,
        code,
        input,
        timeoutMs: TIMEOUT_MS,
      });
    } else {
      return res.status(400).json({
        message: `Unsupported language: ${language}. Supported languages are 'javascript' and 'cpp'.`,
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Internal Runner Error",
      error: err.message,
    });
  } finally {
    try {
      if (fs.existsSync(jobDir)) {
        fs.rmSync(jobDir, { recursive: true, force: true });
      }
    } catch (cleanupErr) {
      console.error(`Failed to clean up ${jobDir}:`, cleanupErr);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Execution Runner Service running on port ${PORT}`);
});
