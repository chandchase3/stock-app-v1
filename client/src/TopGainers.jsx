import { useState, useEffect, useRef } from "react";

export default function TopGainers() {
  const [gainers, setGainers] = useState([]);
  const [intervalOn, setIntervalOn] = useState(true);
  const [newSymbol, setNewSymbol] = useState("");
  const [message, setMessage] = useState("");
  const intervalRef = useRef(null);

  const fetchGainers = async () => {
    try {
      const res = await fetch("http://localhost:5000/stocks/top-gainers");
      const data = await res.json();
      setGainers(data);
    } catch (err) {
      console.error("Failed to fetch gainers:", err);
    }
  };

  const handleAddTicker = async (e) => {
    e.preventDefault();
    if (!newSymbol) return;

    try {
      const res = await fetch("http://localhost:5000/stocks/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: newSymbol }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setNewSymbol("");
        fetchGainers(); // refresh immediately
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage("Failed to add ticker");
      console.error(err);
    }
  };

  // Auto-refresh every 3 seconds
  useEffect(() => {
    if (intervalOn) {
      fetchGainers(); // initial fetch
      intervalRef.current = setInterval(fetchGainers, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [intervalOn]);

  const toggleInterval = () => setIntervalOn(!intervalOn);

  return (
    <div>
      <h2>Top Gainers</h2>

      <form onSubmit={handleAddTicker}>
        <input
          type="text"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          placeholder="Enter ticker (e.g. TSLA)"
        />
        <button type="submit">Add Ticker</button>
      </form>
      {message && <p>{message}</p>}

      <button onClick={toggleInterval}>
        {intervalOn ? "Stop Updates" : "Resume Updates"}
      </button>

      <table border="1" cellPadding="5" style={{ marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Change</th>
            <th>% Change</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {gainers.map((stock) => (
            <tr key={stock.symbol}>
              <td>{stock.symbol}</td>
              <td>{stock.price}</td>
              <td>{stock.change}</td>
              <td>{stock.percentChange.toFixed(2)}%</td>
              <td>{stock.volume.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
