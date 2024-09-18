export function calculateRelativeMomentum(prices) {
  const returns = {};

  for (const symbol in prices) {
    if (prices[symbol].length < 12) {
      console.warn(`Not enough data for ${symbol}`);
      continue;
    }
    const startPrice = prices[symbol][prices[symbol].length - 12].adjClose;
    const endPrice = prices[symbol][prices[symbol].length - 1].adjClose;
    returns[symbol] = (endPrice - startPrice) / startPrice;
  }

  return Object.keys(returns).reduce((a, b) =>
    returns[a] > returns[b] ? a : b
  );
}

export function calculateAbsoluteMomentum(prices, bestAsset) {
  if (prices[bestAsset].length < months || prices["BIL"].length < months) {
    console.warn("Not enough data for bestAsset or BIL");
    return false;
  }

  const startPrice =
    prices[bestAsset][prices[bestAsset].length - months].adjClose;
  const endPrice = prices[bestAsset][prices[bestAsset].length - 1].adjClose;
  const assetReturn = (endPrice - startPrice) / startPrice;

  const startRiskFreePrice =
    prices["BIL"][prices["BIL"].length - months].adjClose;
  const endRiskFreePrice = prices["BIL"][prices["BIL"].length - 1].adjClose;
  const riskFreeReturn =
    (endRiskFreePrice - startRiskFreePrice) / startRiskFreePrice;

  return assetReturn > riskFreeReturn;
}
