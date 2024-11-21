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
    <div className="bg-slate-400 grid h-screen justify-center items-center">
      <div className="bg-white p-10 rounded-md shadow-md text-center">
        <div className="text-4xl font-bold mb-4">CAPTCHA Solver</div>
        <div className="text-xl">Coins: {coins}</div>
        <img src={captcha} alt="CAPTCHA" className="my-4" />
        <div className="text-lg mb-2">Time Remaining: {timer} seconds</div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter CAPTCHA"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
        >
          Submit
        </button>
        <button
          onClick={skipCaptcha}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Skip
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <div className="mt-4">
          <div>Correct: {correctCount}</div>
          <div>Wrong: {wrongCount}</div>
          <div>Skipped: {skippedCount}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
