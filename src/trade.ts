import {
  calculateAbsoluteMomentum,
  calculateRelativeMomentum,
} from "./calcMomentum";

import Alpaca from "@alpacahq/alpaca-trade-api";
import dotenv from "dotenv";
import { StockDataBySymbol, StockSymbol } from "./collectDatas";
dotenv.config();

const alpaca = new Alpaca({
  keyId: process.env.NODE_ALPACA_PAPER_KEY,
  secretKey: process.env.NODE_ALPACA_PAPER_SECRET,
  paper: true,
});

export default async function tradeDualMomentum(prices: StockDataBySymbol) {
  console.log("6. Dual Momentum 전략 시작");
  try {
    console.log("7. 상대 모멘텀 계산 시작");
    const bestAsset = calculateRelativeMomentum(prices) as StockSymbol;
    console.log("8. 상대 모멘텀 계산 완료", bestAsset);

    console.log("9. 절대 모멘텀 계산 시작");
    const investInAsset = calculateAbsoluteMomentum(prices, bestAsset);
    console.log("10. 절대 모멘텀 계산 완료", investInAsset);

    const targetSymbol = investInAsset ? bestAsset : "BIL";
    console.log("11. 최종 투자 대상", targetSymbol);

    const currentPosition = await alpaca.getPosition(targetSymbol);
    console.log("12. 보유 중인 자산", currentPosition);

    if (currentPosition) {
      const quantity = currentPosition.qty;
      console.log(`13. 보유 중인 ${targetSymbol} 수량 : ${quantity}`);
      try {
        await alpaca.createOrder({
          symbol: targetSymbol,
          qty: quantity,
          side: "sell",
          type: "market",
          time_in_force: "gtc",
        });
        console.log(`14. 보유 중인 ${targetSymbol} 매도 완료`);
      } catch (err) {
        console.log(`14. 보유 중인 ${targetSymbol} 매도 중 에러 발생`, err);
      }
    }

    const availableCash = (await alpaca.getAccount()).cash;
    console.log("15. 투자 가능 금액", availableCash);
    const targetPrice = (await alpaca.getLatestTrade(targetSymbol)).Price;
    console.log("16. 목표 자산 가격", targetPrice);
    const targetQuantity = Math.floor(availableCash / targetPrice);
    console.log("17. 투자 수량", targetQuantity);

    try {
      console.log(`18. ${targetSymbol} 주문 시작`);
      await alpaca.createOrder({
        symbol: targetSymbol,
        qty: targetQuantity,
        side: "buy",
        type: "market",
        time_in_force: "gtc",
      });
    } catch (err) {
      console.log(`18. ${targetSymbol} 주문 중 에러 발생`, err);
    }
  } catch (_err) {
    const err = _err as any;
    console.error("6. Dual Momentum 전략 중 에러 발생", err);
  }
}
