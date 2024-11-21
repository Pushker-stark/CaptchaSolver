import express, { Request, Response } from "express";
import { generateCaptcha } from "../utils/captchaGenerator";
import { generateCaptchaImage } from "../utils/captchaImageGenerator";
import { createUser, getUser, updateUserCoins, updateUserCaptcha } from "../utils/database";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Root route for testing
router.get("/", (_req: Request, res: Response) => {
    res.json({ msg: "Hello Captcha!" });
});

// Start session and provide initial CAPTCHA
router.post("/start", (req: Request, res: Response) => {
    try {
        const userId = uuidv4();
        const captchaText = generateCaptcha();
        const captchaImage = generateCaptchaImage(captchaText);

        createUser(userId, captchaText); // Store the text in the database for validation

        res.json({ userId,captchaText:captchaText,captcha: captchaImage});
    } catch (error) {
        console.error("Error in /start:", error);
        res.status(500).json({ error: "Failed to generate CAPTCHA" });
    }
});

// Validate CAPTCHA and issue a new one
// Validate CAPTCHA and issue a new one
router.post("/submit", (req: Request, res: Response): any => {
    const { userId, answer } = req.body;

    if (!userId || !answer) {
        return res.status(400).json({ error: "User ID and answer are required" });
    }

    try {
        const user = getUser(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Normalize both stored CAPTCHA and user input for comparison
        const storedCaptcha = user.currentCaptcha.trim().toUpperCase();
        const userAnswer = answer.trim().toUpperCase();

        if (storedCaptcha === userAnswer) {
            updateUserCoins(userId, 1); // Increment user's coin balance
            const newCaptchaText = generateCaptcha();
            const newCaptchaImage = generateCaptchaImage(newCaptchaText);
            updateUserCaptcha(userId, newCaptchaText); // Update stored CAPTCHA text

            return res.json({ coins: user.coins, captcha: newCaptchaImage });
        } else {
            return res.status(400).json({ error: "Incorrect CAPTCHA" });
        }
    } catch (error) {
        console.error("Error in /submit:", error);
        res.status(500).json({ error: "Failed to validate CAPTCHA" });
    }
});


export default router;
