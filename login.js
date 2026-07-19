export const login = async (req, res) => {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {

            return res.status(404).json({
                message: "User not found",
            });

        }

        const token = jwt.sign(
            { id: user._id },
            "secret",
            { expiresIn: "1d" }
        );

        res.json({ token });

};