import AlphaVantageAPI from "alphavantage";
import dotenv from "dotenv";
dotenv.config();

const SYMBOLS = ["SPY", "EFA", "BIL"] as const;

export type StockSymbol = (typeof SYMBOLS)[number];

export type StockData = {
  "Meta Data": {
    "1. Information": "Monthly Prices and Volumes";
    "2. Symbol": "IBM";
    "3. Last Refreshed": "2024-09-17";
    "4. Time Zone": "US/Eastern";
  };
  "Monthly Time Series": {
    [date: string]: {
      "1. open": string;
      "2. high": string;
      "3. low": string;
      "4. close": string;
      "5. volume": string;
    };
  };
};

export type StockDataBySymbol = Record<
  StockSymbol,
  StockData["Monthly Time Series"]
>;

const alpha = AlphaVantageAPI({
  key: process.env.NODE_ALPHA_VANTAGE_API_KEY ?? "",
});

function filterDataByDate(data: StockData, startDate: string) {
  const filtered: StockData["Monthly Time Series"] = {};

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
    const monthlyResult = await Promise.all(
      SYMBOLS.map((symbol) => alpha.data.monthly<StockData>(symbol))
    );

    const result: Record<StockSymbol, StockData["Monthly Time Series"]> = {
      SPY: {},
      EFA: {},
      BIL: {},
    };

    monthlyResult.forEach((data) => {
      result[data["Meta Data"]["2. Symbol"] as StockSymbol] = filterDataByDate(
        data,
        "1970-01-01"
      );
    });

    return result;
  } catch (error) {
    console.error(error);
  }
}

// 특정 주식(AAPL)의 월간 데이터 가져오기

export default async function fetchAllData() {
  return await getMonthlyData();
}
