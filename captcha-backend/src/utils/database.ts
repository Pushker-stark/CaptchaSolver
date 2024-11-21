interface User {
    id: string;
    coins: number;
    currentCaptcha: string;
    correct: number;
    wrong: number;
    skipped: number;
    captchaTimestamp: number; 
}

const users: Record<string, User> = {};

export const getUser = (id: string) => users[id];

export const createUser = (id: string, captcha: string, stats: { correct: number, wrong: number, skipped: number }) => {
    const captchaTimestamp = Date.now() + 30000; 
    users[id] = {
        id,
        coins: 0,
        currentCaptcha: captcha,
        correct: stats.correct,
        wrong: stats.wrong,
        skipped: stats.skipped,
        captchaTimestamp,
    };
};

export const updateUserCoins = (id: string, coins: number) => {
    if (users[id]) {
        users[id].coins += coins;
    }
};

export const updateUserCaptcha = (id: string, captcha: string) => {
    if (users[id]) {
        users[id].currentCaptcha = captcha;
        users[id].captchaTimestamp = Date.now() + 30000; 
    }
};

export const updateUserStats = (id: string, type: "correct" | "wrong" | "skipped") => {
    if (users[id]) {
        switch (type) {
            case "correct":
                users[id].correct += 1;
                break;
            case "wrong":
                users[id].wrong += 1;
                break;
            case "skipped":
                users[id].skipped += 1;
                break;
        }
    }
};

export const isCaptchaExpired = (id: string): boolean => {
    const user = users[id];
    if (user) {
        return Date.now() > user.captchaTimestamp; 
    }
    return true;
};
