import yahooFinance from "yahoo-finance2";

const symbols = ["SPY", "EFA", "BIL"];

async function fetchData(symbol) {
  const data = await yahooFinance.historical(symbol, {
    period1: "1970-01-01",
    period2: new Date(),
  });
  return data;
}

export default async function fetchAllData() {
  const allData = {};

  for (const symbol of symbols) {
    allData[symbol] = await fetchData(symbol);
  }

  return allData;
}
