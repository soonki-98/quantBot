"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRelativeMomentum = calculateRelativeMomentum;
exports.calculateAbsoluteMomentum = calculateAbsoluteMomentum;
function calculateRelativeMomentum(prices) {
    const returns = {};
    for (const symbol in prices) {
        if (Object.keys(prices[symbol]).length < 12) {
            console.warn(`Not enough data for ${symbol}`);
            continue;
        }
        const priceArray = Object.keys(prices[symbol]);
        const startPrice = parseFloat(prices[symbol][priceArray[priceArray.length - 12]]["4. close"]);
        const endPrice = parseFloat(prices[symbol][priceArray[priceArray.length - 1]]["4. close"]);
        returns[symbol] = (endPrice - startPrice) / startPrice;
    }
    return Object.keys(returns).reduce((a, b) => returns[a] > returns[b] ? a : b);
}
function calculateAbsoluteMomentum(prices, bestAsset, months = 12) {
    if (Object.keys(prices[bestAsset]).length < months ||
        Object.keys(prices["BIL"]).length < months) {
        console.warn("Not enough data for bestAsset or BIL");
        return false;
    }
    const bestAssetDates = Object.keys(prices[bestAsset]);
    const bilDates = Object.keys(prices["BIL"]);
    const startPrice = parseFloat(prices[bestAsset][bestAssetDates[bestAssetDates.length - months]]["4. close"]);
    const endPrice = parseFloat(prices[bestAsset][bestAssetDates[bestAssetDates.length - 1]]["4. close"]);
    const assetReturn = (endPrice - startPrice) / startPrice;
    const startRiskFreePrice = parseFloat(prices["BIL"][bilDates[bilDates.length - months]]["4. close"]);
    const endRiskFreePrice = parseFloat(prices["BIL"][bilDates[bilDates.length - 1]]["4. close"]);
    const riskFreeReturn = (endRiskFreePrice - startRiskFreePrice) / startRiskFreePrice;
    return assetReturn > riskFreeReturn;
}
