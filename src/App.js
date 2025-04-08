import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { FaSun, FaMoon } from "react-icons/fa";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState("home");
  const [options, setOptions] = useState(() => JSON.parse(localStorage.getItem("options")) || []);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [sets, setSets] = useState(() => JSON.parse(localStorage.getItem("sets")) || {});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  const addOption = () => {
    if (input.trim()) {
      const updated = [...options, input.trim()];
      setOptions(updated);
      localStorage.setItem("options", JSON.stringify(updated));
      setInput("");
    }
  };

  const deleteOption = (index) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
    localStorage.setItem("options", JSON.stringify(updated));
  };

  const shuffleOptions = () => {
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
    localStorage.setItem("options", JSON.stringify(shuffled));
  };

  const saveSet = () => {
    const name = prompt("Enter a name for this set:");
    if (name) {
      const updatedSets = { ...sets, [name]: options };
      setSets(updatedSets);
      localStorage.setItem("sets", JSON.stringify(updatedSets));
    }
  };

  const loadSet = (name) => {
    const selected = sets[name];
    if (selected) {
      setOptions(selected);
      localStorage.setItem("options", JSON.stringify(selected));
      alert(`Set "${name}" loaded!`);
    }
  };

  const exportSet = () => {
    const blob = new Blob([JSON.stringify(options)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-choice-set.json';
    a.click();
  };

  const spin = () => {
    if (options.length === 0) return;
    setSpinning(true);
    setResult(null);
    setTimeout(() => {
      const picked = options[Math.floor(Math.random() * options.length)];
      const time = new Date().toLocaleTimeString();
      setResult(picked);
      setHistory(prev => [...prev.slice(-9), `${picked} at ${time}`]);
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <header>
        <h1>🎲 SpinPick</h1>
        <nav>
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("add")}>Add</button>
          <button onClick={() => setPage("spin")}>Spin</button>
          <button onClick={() => setPage("sets")}>Saved Sets</button>
        </nav>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </header>

      {page === "home" && (
        <div className="page">
          <h2>Welcome to SpinPick 🎯</h2>
          <p>Make decisions fun and easy!</p>
        </div>
      )}

      {page === "add" && (
        <div className="page">
          <h2>Add Options</h2>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter an option..." />
          <button onClick={addOption}>Add</button>
          <button onClick={shuffleOptions}>🔀 Shuffle</button>
          <ul>
            {options.map((opt, idx) => (
              <li key={idx}>{opt} <button onClick={() => deleteOption(idx)}>❌</button></li>
            ))}
          </ul>
          <button onClick={saveSet}>💾 Save This Set</button>
          <button onClick={exportSet}>📁 Export</button>
        </div>
      )}

      {page === "spin" && (
        <div className="page">
          <h2>Spin to Decide!</h2>
          <button onClick={spin} disabled={spinning}>🎯 Spin</button>
          {spinning && <p>Spinning...</p>}
          {result && (
            <div className="result">
              <h3>🎉 Result: {result}</h3>
              <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />
              <input placeholder="Name this result..." style={{ marginTop: "0.5rem", padding: "0.4rem", borderRadius: "6px", width: "100%" }} />
            </div>
          )}

          {history.length > 0 && (
            <div>
              <h4>🔁 Spin History</h4>
              <ul>
                {history.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {page === "sets" && (
        <div className="page">
          <h2>Saved Sets</h2>
          {Object.keys(sets).length === 0 ? <p>No saved sets yet.</p> : (
            <ul>
              {Object.keys(sets).map((name) => (
                <li key={name}>
                  {name} <button onClick={() => loadSet(name)}>Load</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
