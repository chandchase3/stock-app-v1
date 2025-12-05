import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] }); // create an instance

export const fetchStockData = async (symbol) => {
  try {
    const quote = await yf.quote(symbol);

    return {
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      volume: quote.regularMarketVolume,
      float: quote.floatShares || null,
      percentChange: quote.regularMarketChangePercent,
    };
  } catch (err) {
    console.error(`Error fetching stock data for ${symbol}:`, err.message);
    throw err;
  }
};
