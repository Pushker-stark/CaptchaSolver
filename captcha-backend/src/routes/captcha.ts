import express, { Request, Response } from "express";
import { generateCaptcha } from "../utils/captchaGenerator";
import { generateCaptchaImage } from "../utils/captchaImageGenerator";
import { createUser, getUser, updateUserCoins, updateUserCaptcha, updateUserStats } from "../utils/database";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const CAPTCHA_TIMEOUT_MS = 30000; 

router.post("/start", (req: Request, res: Response) => {
    try {
        const userId = uuidv4();
        const captchaText = generateCaptcha();
        const captchaImage = generateCaptchaImage(captchaText);

        createUser(userId, captchaText, { correct: 0, wrong: 0, skipped: 0 }); 

        res.json({ userId, captcha: captchaImage, timeout: CAPTCHA_TIMEOUT_MS });
    } catch (error) {
        console.error("Error in /start:", error);
        res.status(500).json({ error: "Failed to generate CAPTCHA" });
    }
});


router.post("/skip", (req: Request, res: Response):any => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const user = getUser(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        updateUserStats(userId, "skipped");

        const newCaptchaText = generateCaptcha();
        const newCaptchaImage = generateCaptchaImage(newCaptchaText);
        updateUserCaptcha(userId, newCaptchaText); 

        return res.json({ captcha: newCaptchaImage, timeout: CAPTCHA_TIMEOUT_MS });
    } catch (error) {
        console.error("Error in /skip:", error);
        res.status(500).json({ error: "Failed to skip CAPTCHA" });
    }
});


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

        const storedCaptcha = user.currentCaptcha.trim().toUpperCase();
        const userAnswer = answer.trim().toUpperCase();

        if (storedCaptcha === userAnswer) {
            updateUserCoins(userId, 1);
            updateUserStats(userId, "correct"); 
            const newCaptchaText = generateCaptcha();
            const newCaptchaImage = generateCaptchaImage(newCaptchaText);
            updateUserCaptcha(userId, newCaptchaText);

            return res.json({ coins: user.coins, captcha: newCaptchaImage, timeout: CAPTCHA_TIMEOUT_MS });
        } else {
            updateUserStats(userId, "wrong"); 
            return res.status(400).json({ error: "Incorrect CAPTCHA" });
        }
    } catch (error) {
        console.error("Error in /submit:", error);
        res.status(500).json({ error: "Failed to validate CAPTCHA" });
    }
});

export default router;
