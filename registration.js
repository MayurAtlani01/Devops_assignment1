import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
        const { username, password } = req.body;

        const existing = await User.findOne({ username });

        if (existing) {
            return res.status(400).json({
                message: "Username already exists",
            });
        }

        const user = await User.create({
            username,
            password: password,
        });

        const token = jwt.sign(
            { id: user._id },
            "secret",
            { expiresIn: "1d" }
        );

        res.status(201).json({
            token,
        });
};