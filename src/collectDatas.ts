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

async function getMonthlyData() {
  console.log("2. 월별 데이터 수집 시작");
  try {
    const monthlyResult = await Promise.all(
      SYMBOLS.map((symbol) => alpha.data.monthly<StockData>(symbol))
    );
    console.log("3. 월별 데이터 수집 완료");

    const result: Record<StockSymbol, StockData["Monthly Time Series"]> = {
      SPY: {},
      EFA: {},
      BIL: {},
    };

    console.log("4. SPY, EFA, BIL 별로 데이터 정리 시작");
    monthlyResult.forEach((data) => {
      result[data["Meta Data"]["2. Symbol"] as StockSymbol] =
        data["Monthly Time Series"];
    });

    console.log("5. SPY, EFA, BIL 별로 데이터 정리 완료");
    return result;
  } catch (error) {
    console.error("2. 월별 데이터 수집 중 에러 발생", error);
    throw error;
  }
}

export default async function fetchAllData() {
  console.log("1. 데이터 수집 시작");
  return await getMonthlyData();
}
