import { StockDataBySymbol, StockSymbol } from "./collectDatas";

export function calculateRelativeMomentum(
  prices: StockDataBySymbol
): StockSymbol | undefined {
  const returns: Record<StockSymbol, number> = {} as Record<
    StockSymbol,
    number
  >;

  for (const symbol in prices) {
    if (Object.keys(prices[symbol as StockSymbol]).length < 12) {
      console.warn(`Not enough data for ${symbol}`);
      continue;
    }

    const priceArray = Object.keys(prices[symbol as StockSymbol]);
    const startPrice = parseFloat(
      prices[symbol as StockSymbol][priceArray[priceArray.length - 12]][
        "4. close"
      ]
    );
    const endPrice = parseFloat(
      prices[symbol as StockSymbol][priceArray[priceArray.length - 1]][
        "4. close"
      ]
    );

    returns[symbol as StockSymbol] = (endPrice - startPrice) / startPrice;
  }

  return Object.keys(returns).reduce((a, b) =>
    returns[a as StockSymbol] > returns[b as StockSymbol] ? a : b
  ) as StockSymbol;
}

export function calculateAbsoluteMomentum(
  prices: StockDataBySymbol,
  bestAsset: StockSymbol,
  months: number = 12
): boolean {
  if (
    Object.keys(prices[bestAsset]).length < months ||
    Object.keys(prices["BIL"]).length < months
  ) {
    console.warn("Not enough data for bestAsset or BIL");
    return false;
  }

  const bestAssetDates = Object.keys(prices[bestAsset]);
  const bilDates = Object.keys(prices["BIL"]);

  const startPrice = parseFloat(
    prices[bestAsset][bestAssetDates[bestAssetDates.length - months]][
      "4. close"
    ]
  );
  const endPrice = parseFloat(
    prices[bestAsset][bestAssetDates[bestAssetDates.length - 1]]["4. close"]
  );
  const assetReturn = (endPrice - startPrice) / startPrice;

  const startRiskFreePrice = parseFloat(
    prices["BIL"][bilDates[bilDates.length - months]]["4. close"]
  );
  const endRiskFreePrice = parseFloat(
    prices["BIL"][bilDates[bilDates.length - 1]]["4. close"]
  );
  const riskFreeReturn =
    (endRiskFreePrice - startRiskFreePrice) / startRiskFreePrice;

  return assetReturn > riskFreeReturn;
}
