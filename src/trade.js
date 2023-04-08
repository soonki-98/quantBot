import { calculateAbsoluteMomentum, calculateRelativeMomentum } from "./calcMomentum.js";

import Alpaca from "@alpacahq/alpaca-trade-api";

const alpaca = new Alpaca({
  keyId: process.env.NODE_ALPACA_PAPER_KEY,
  secretKey: process.env.NODE_ALPACA_PAPER_SECRET,
  paper: true,
  usePolygon: false,
});

export default async function tradeDualMomentum(prices) {
  try {
    const bestAsset = calculateRelativeMomentum(prices);
    const investInAsset = calculateAbsoluteMomentum(prices, bestAsset);

    const targetSymbol = investInAsset ? bestAsset : "BIL";
    const currentPosition = await alpaca.getPosition(targetSymbol);

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
    const targetPrice = (await alpaca.getLatestTrade(targetSymbol)).price;
    const targetQuantity = Math.floor(availableCash / targetPrice);

    await alpaca.createOrder({
      symbol: targetSymbol,
      qty: targetQuantity,
      side: "buy",
      type: "market",
      time_in_force: "gtc",
    });
  } catch (err) {
    console.log("err!!", Object.keys(err));
  }
}
