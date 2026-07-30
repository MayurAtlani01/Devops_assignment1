import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../logger/logger.js";

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });

    if (existing) {
      logger.warn(`Registration failed: Username '${username}' already exists`);

      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    logger.info(`New user registered: ${username}`);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      token,
    });
  } catch (err) {
    logger.error(`Registration Error: ${err.message}`);

    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      logger.warn(`Login failed: User '${username}' not found`);

      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn(`Login failed: Invalid password for '${username}'`);

      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    logger.info(`User logged in: ${username}`);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      token,
    });
  } catch (err) {
    logger.error(`Login Error: ${err.message}`);

    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
