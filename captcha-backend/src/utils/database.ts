interface User {
    id: string;
    coins: number;
    currentCaptcha: string;
}

const users: Record<string, User> = {};

export const getUser = (id: string) => users[id];
export const createUser = (id: string, captcha: string) => {
    users[id] = { id, coins: 0, currentCaptcha: captcha };
};
export const updateUserCoins = (id: string, coins: number) => {
    if (users[id]) users[id].coins += coins;
};
export const updateUserCaptcha = (id: string, captcha: string) => {
    if (users[id]) users[id].currentCaptcha = captcha;
};
