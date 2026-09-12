import Code from "../models/Code.js";
import logger from "../logger/logger.js";

export const runCode = async (req, res) => {
  try {
    const { code, input = "", language = "javascript" } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        message: "Code must be provided as a non-empty string",
      });
    }

    const runnerUrl = process.env.RUNNER_SERVICE_URL || "http://127.0.0.1:5000";

    const response = await fetch(`${runnerUrl}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language,
        code,
        input,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    if (data.compilationError) {
      return res.status(400).json({
        message: "Compilation Error",
        stdout: data.stdout || "",
        stderr: data.stderr || "",
        executionTime: data.executionTime,
      });
    }

    if (data.timedOut) {
      return res.status(408).json({
        message: "Execution Timed Out",
        stdout: data.stdout || "",
        stderr: data.stderr || "Execution timed out",
        executionTime: data.executionTime,
      });
    }

    if (!data.success && data.exitCode !== 0) {
      return res.status(400).json({
        message: "Runtime Error",
        stdout: data.stdout || "",
        stderr: data.stderr || "",
        executionTime: data.executionTime,
      });
    }

    return res.json({
      stdout: data.stdout,
      stderr: data.stderr,
      executionTime: data.executionTime,
    });
  } catch (err) {
    logger.error(`Runner communication error: ${err.message}`);
    return res.status(500).json({
      message: "Failed to communicate with code execution runner",
      error: err.message,
    });
  }
};

export const saveCode = async (req, res) => {
  try {
    const { title, code } = req.body;

    const savedCode = await Code.create({
      title,
      code,
      user: req.user.id,
    });

    res.status(201).json(savedCode);
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const getCodes = async (req, res) => {
  try {
    const codes = await Code.find({
      user: req.user.id,
    });

    res.json(codes);
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
