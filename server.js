import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import { exec } from "child_process";

const app = express();

/* -------------------- MongoDB -------------------- */

mongoose
  .connect("mongodb://127.0.0.1:27017/compiler")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


/* -------------------- Run Code API -------------------- */

app.post("/run", async (req, res) => {
  const { code, input } = req.body;

    // Save code and input into temporary files
    fs.writeFileSync("code.js", code);
    fs.writeFileSync("input.txt", input);

    const start = Date.now();

    exec("node code.js < input.txt", (error, stdout, stderr) => {
      const end = Date.now();

      res.json({
        stdout,
        stderr,
        executionTime: `${end - start} ms`,
      });
    });
});

/* -------------------- Save Code API -------------------- */
app.post("/save", auth, async (req, res) => {
    const { title, code } = req.body;

    const savedCode = await Code.create({
      title,
      code,
      user: req.user.id,
    });

    res.status(201).json(savedCode);
});

/* -------------------- Get All Saved Codes -------------------- */

app.get("/codes", async (req, res) => {
    const codes = await Code.find();

    res.json(codes);
});

/* -------------------- Start Server -------------------- */

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
