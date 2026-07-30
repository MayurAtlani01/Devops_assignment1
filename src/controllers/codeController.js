import fs from "fs";
import { exec } from "child_process";
import Code from "../models/Code.js";

export const runCode = async (req, res) => {
  try {
    const { code, input } = req.body;

    fs.writeFileSync("code.js", code);
    fs.writeFileSync("input.txt", input);

    const start = Date.now();

    exec("node code.js < input.txt", (error, stdout, stderr) => {
      const end = Date.now();

      if (error) {
        return res.status(500).json({
          message: "Code execution failed",
          error: error.message,
        });
      }

      res.json({
        stdout,
        stderr,
        executionTime: `${end - start} ms`,
      });
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
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
