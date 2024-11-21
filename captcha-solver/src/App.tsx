import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [userId, setUserId] = useState<string>("");
  const [captcha, setCaptcha] = useState<string>(""); // Holds the CAPTCHA image (base64 string)
  const [input, setInput] = useState<string>("");
  const [coins, setCoins] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startSession = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/captcha/start");
        setUserId(response.data.userId);
        setCaptcha(response.data.captcha); // CAPTCHA image in base64 format
      } catch (error) {
        console.error("Error starting session:", error);
        setError("Failed to load CAPTCHA");
      }
    };
    startSession();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/captcha/submit", {
        userId,
        answer: input,
      });
      setCoins(response.data.coins);
      setCaptcha(response.data.captcha); // Load new CAPTCHA
      setInput("");
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="bg-slate-400 grid h-screen place-items-center">
      <div className="bg-white w-96 py-8 px-6 grid gap-4 justify-center items-center rounded-md shadow-lg">
        <div className="text-3xl font-bold text-center">CAPTCHA Solver</div>
        <div className="text-lg">Coins: <span className="font-semibold">{coins}</span></div>
        
        {/* CAPTCHA Image */}
        {captcha && (
          <div className="flex justify-center">
            <img
              src={captcha} // Display the CAPTCHA image
              alt="CAPTCHA"
              className="w-72 h-20 object-contain border border-gray-300 rounded"
            />
          </div>
        )}

        {/* Input and Submit */}
        <div className="grid gap-2">
          <input
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter CAPTCHA"
          />
          <button
            className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default App;
