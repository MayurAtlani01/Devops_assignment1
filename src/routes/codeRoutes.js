import express from "express";
import { runCode, saveCode, getCodes } from "../controllers/codeController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/run", runCode);
router.post("/save", auth, saveCode);
router.get("/codes", auth, getCodes);

export default router;
