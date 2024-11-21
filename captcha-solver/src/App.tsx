import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [userId, setUserId] = useState<string>("");
  const [captcha, setCaptcha] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [coins, setCoins] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [skippedCount, setSkippedCount] = useState<number>(0);
  const [timer, setTimer] = useState<number>(30);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const startSession = async () => {
      // console.log(apiUrl);
      const response = await axios.post(`${apiUrl}/api/captcha/start`);
      setUserId(response.data.userId);
      setCaptcha(response.data.captcha);
      setTimer(response.data.timeout / 1000);
    };
    startSession();
  }, []);

  useEffect(() => {
    if (timer === 0) {
      skipCaptcha();
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async () => {
    try {
      // console.log(apiUrl);
      const response = await axios.post(`${apiUrl}/api/captcha/submit`, {
        userId,
        answer: input,
      });
      setCoins(response.data.coins);
      setCaptcha(response.data.captcha);
      setTimer(response.data.timeout / 1000);
      setInput("");
      setError(null);
      setCorrectCount((prev) => prev + 1);
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
      setWrongCount((prev) => prev + 1);
    }
  };

  const skipCaptcha = async () => {
    try {
      // console.log(apiUrl);
      const response = await axios.post(`${apiUrl}/api/captcha/skip`, { userId });
      setCaptcha(response.data.captcha);
      setTimer(response.data.timeout / 1000);
      setError(null);
      setSkippedCount((prev) => prev + 1);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to skip CAPTCHA");
    }
  };

  return (
    <div className=" grid h-screen justify-center items-center">
      <div className="bg-white p-10 rounded-md shadow-md text-center w-96">
        <div className="text-4xl font-bold mb-4 text-gray-800">CAPTCHA Solver</div>
        <div className="text-xl text-gray-600 mb-2"> 💰 Coins: {coins}</div>
        <img src={captcha} alt="CAPTCHA" className="my-4 mx-auto w-full rounded" />
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <p className="text-pink-700">Special Alpha Numeric Case Sensitive</p>
          <p className="bg-blue-900 text-white py-1 px-2 rounded">{timer} s</p>
        </div>
        <div className="relative mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter CAPTCHA"
            className="pr-15 pl-4 border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded w-full py-2 text-gray-800"
          />
          <button
            onClick={skipCaptcha}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white py-1 px-3 rounded-r hover:bg-blue-700"
          >
            Skip
          </button>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-blue-900 text-white py-2 px-4 rounded w-full mb-4 hover:bg-blue-700"
        >
          Submit
        </button>
        {error && <p className="text-pink-500 text-sm mb-4">{error}</p>}
        <div className="grid grid-cols-3 gap-2 text-gray-700 text-sm">
          <div className="p-2 shadow-md rounded bg-gray-100 text-center">⏩ Skipped: {skippedCount}</div>
          <div className="p-2 shadow-md rounded bg-gray-100 text-center">❌ Wrong: {wrongCount}</div>
          <div className="p-2 shadow-md rounded bg-gray-100 text-center">✅ Correct: {correctCount}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
