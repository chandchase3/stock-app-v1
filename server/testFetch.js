import { fetchStockData } from "./utils/fetchStockData.js";

const test = async () => {
  try {
    const data = await fetchStockData("AAPL");
    console.log(data);
  } catch (err) {
    console.error("Error fetching stock data:", err.message);
  }
};

test();
