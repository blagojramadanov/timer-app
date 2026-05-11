import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const remainingRef = useRef<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInputValue(value);
    setSecondsLeft(value);
    remainingRef.current = value * 1000;
  };

  const handleStart = () => {
    if (intervalRef.current) return;

    const startDuration =
      remainingRef.current > 0 ? remainingRef.current : inputValue * 1000;

    const startTime = Date.now();
    endTimeRef.current = startTime + startDuration;

    intervalRef.current = window.setInterval(() => {
      if (!endTimeRef.current) return;

      const diff = endTimeRef.current - Date.now();

      if (diff <= 0) {
        setSecondsLeft(0);
        remainingRef.current = 0;

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        endTimeRef.current = null;
        return;
      }

      remainingRef.current = diff;
      setSecondsLeft(diff / 1000);
    }, 100);
  };

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;

      if (endTimeRef.current) {
        remainingRef.current = endTimeRef.current - Date.now();
      }
    }
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    endTimeRef.current = null;
    remainingRef.current = inputValue * 1000;
    setSecondsLeft(inputValue);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="app">
      <div className="timer-card">
        <h1 className="title">Zeit festlegen:</h1> <br />
        <input
          className="input"
          type="number"
          value={inputValue}
          onChange={handleChange}
        />
        <div className="time-display">
          <span className="time">Time left:</span> <br />
          <br />
          <span className="time">{secondsLeft.toFixed(3)}s</span>
        </div>{" "}
        <br />
        <div className="button-group">
          <button className="btn start" onClick={handleStart}>
            Start
          </button>

          <button className="btn pause" onClick={handlePause}>
            Pause
          </button>

          <button className="btn reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
