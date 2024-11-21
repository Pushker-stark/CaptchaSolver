import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import captchaRoutes from "./routes/captcha";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/captcha", captchaRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
