export const generateCaptcha = (): string => {
    const lettersAndNumbers = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const specialCharacters = "!@#$%^&*()_+{}[]<>?";
    const captchaLength = 10;

    const captchaArray = Array.from({ length: captchaLength }, (_, index) => {
        if (index === 0) {
            // Ensure the first character is the special character
            return specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
        }
        // Randomly select from letters and numbers for the rest
        return lettersAndNumbers[Math.floor(Math.random() * lettersAndNumbers.length)];
    });

    // Shuffle the array once
    for (let i = captchaArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [captchaArray[i], captchaArray[j]] = [captchaArray[j], captchaArray[i]];
    }

    return captchaArray.join('');
};
