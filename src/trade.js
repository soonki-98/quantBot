import { calculateAbsoluteMomentum, calculateRelativeMomentum } from "./calcMomentum.js";

import Alpaca from "@alpacahq/alpaca-trade-api";

const alpaca = new Alpaca({
  keyId: process.env.NODE_ALPACA_PAPER_KEY,
  secretKey: process.env.NODE_ALPACA_PAPER_SECRET,
  paper: true,
});

export default async function tradeDualMomentum(prices) {
  try {
    const bestAsset = calculateRelativeMomentum(prices);
    const investInAsset = calculateAbsoluteMomentum(prices, bestAsset);

    const targetSymbol = investInAsset ? bestAsset : "BIL";
    console.log(":::::::", targetSymbol);
    const currentPosition = await alpaca.getPosition(targetSymbol);
    console.log(currentPosition);
    if (currentPosition) {
      const quantity = currentPosition.qty;
      await alpaca.createOrder({
        symbol: targetSymbol,
        qty: quantity,
        side: "sell",
        type: "market",
        time_in_force: "gtc",
      });
    }

    const availableCash = (await alpaca.getAccount()).cash;
    console.log("availableCash", availableCash);
    const targetPrice = (await alpaca.getLatestTrade(targetSymbol)).Price;
    console.log("targetPrice", targetPrice);
    const targetQuantity = Math.floor(availableCash / targetPrice);
    console.log("targetQuantity", targetQuantity);

    const result = await alpaca.createOrder({
      symbol: targetSymbol,
      qty: targetQuantity,
      side: "buy",
      type: "market",
      time_in_force: "gtc",
    });
    console.log(result);
  } catch (err) {
    console.log("err!!", err.response);
  }
}
