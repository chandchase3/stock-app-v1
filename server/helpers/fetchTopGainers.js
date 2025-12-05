// server/helpers/fetchTopGainers.js
import YahooFinance from "yahoo-finance2";

import TrackedStock from "../models/TrackedStock.js";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export const fetchTopGainers = async () => {
  // Fetch tickers from DB
  const tracked = await TrackedStock.find();
  const tickers = tracked.map(s => s.symbol);

  // If no tickers, fallback to a default list
  if (!tickers.length) {
    tickers.push("AAPL", "MSFT", "GOOG", "AMZN", "TSLA");
  }

  const data = await Promise.all(
    tickers.map(async (symbol) => {
      const quote = await yf.quote(symbol);
      const percentChange =
        quote.regularMarketChangePercent ?? quote.postMarketChangePercent ?? 0;

      return {
        symbol,
        price: quote.regularMarketPrice ?? quote.previousClose,
        percentChange,
        volume: quote.regularMarketVolume ?? 0,
        change: quote.regularMarketChange ?? 0,
      };
    })
  );

  return data.sort((a, b) => b.percentChange - a.percentChange).slice(0, 10);
};
