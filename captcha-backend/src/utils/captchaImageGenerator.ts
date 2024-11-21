import { createCanvas, CanvasRenderingContext2D } from "canvas";


export const generateCaptchaImage = (text: string): string => {
    const width = 200;  
    const height = 80;  

   
    const canvas = createCanvas(width, height);
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

   
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, width, height);

   
    for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`;
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 10, 0, Math.PI * 2);
        ctx.fill();
    }

    
    ctx.font = "bold 30px Arial";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);

    
    return canvas.toDataURL(); 
};
