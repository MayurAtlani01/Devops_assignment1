import jwt from "jsonwebtoken";

export default function auth(req, res, next) {

    const header = req.headers.authorization;

    if (!header) {

        return res.status(401).json({
            message: "Token missing",
        });

    }

    const token = header.split(" ")[1];

        const decoded = jwt.verify(
            token,
            "secret"
        );

        req.user = decoded;

        next();
}