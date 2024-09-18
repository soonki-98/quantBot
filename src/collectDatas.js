import AlphaVantageAPI from "alphavantage";
import dotenv from "dotenv";
dotenv.config();

const alpha = AlphaVantageAPI({ key: process.env.NODE_ALPHA_VANTAGE_API_KEY });

function filterDataByDate(data, startDate) {
  const filtered = {};

  for (const date in data["Monthly Time Series"]) {
    if (new Date(date) >= new Date(startDate)) {
      filtered[date] = data["Monthly Time Series"][date];
    }
  }
  return filtered;
}

// 특정 주식(AAPL)의 월간 데이터 가져오기
async function getMonthlyData() {
  try {
    const results = await Promise.all(
      ["SPY", "EFA", "BIL"].map((symbol) => alpha.data.monthly(symbol))
    );
    const filteredResults = results.map((data, i) =>
      filterDataByDate(data, "1970-01-01")
    );
    console.log(filteredResults);
    return filteredResults;
  } catch (error) {
    console.error(error);
  }
}

// 특정 주식(AAPL)의 월간 데이터 가져오기

export default async function fetchAllData() {
  return await getMonthlyData();
}
