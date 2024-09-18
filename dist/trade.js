"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tradeDualMomentum;
const calcMomentum_1 = require("./calcMomentum");
const alpaca_trade_api_1 = __importDefault(require("@alpacahq/alpaca-trade-api"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const alpaca = new alpaca_trade_api_1.default({
    keyId: process.env.NODE_ALPACA_PAPER_KEY,
    secretKey: process.env.NODE_ALPACA_PAPER_SECRET,
    paper: true,
});
function tradeDualMomentum(prices) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("6. Dual Momentum 전략 시작");
        try {
            console.log("7. 상대 모멘텀 계산 시작");
            const bestAsset = (0, calcMomentum_1.calculateRelativeMomentum)(prices);
            console.log("8. 상대 모멘텀 계산 완료", bestAsset);
            console.log("9. 절대 모멘텀 계산 시작");
            const investInAsset = (0, calcMomentum_1.calculateAbsoluteMomentum)(prices, bestAsset);
            console.log("10. 절대 모멘텀 계산 완료", investInAsset);
            const targetSymbol = investInAsset ? bestAsset : "BIL";
            console.log("11. 최종 투자 대상", targetSymbol);
            const currentPosition = yield alpaca.getPosition(targetSymbol);
            console.log("12. 보유 중인 자산", currentPosition);
            if (currentPosition) {
                const quantity = currentPosition.qty;
                console.log(`13. 보유 중인 ${targetSymbol} 수량 : ${quantity}`);
                try {
                    yield alpaca.createOrder({
                        symbol: targetSymbol,
                        qty: quantity,
                        side: "sell",
                        type: "market",
                        time_in_force: "gtc",
                    });
                    console.log(`14. 보유 중인 ${targetSymbol} 매도 완료`);
                }
                catch (err) {
                    console.log(`14. 보유 중인 ${targetSymbol} 매도 중 에러 발생`, err);
                }
            }
            const availableCash = (yield alpaca.getAccount()).cash;
            console.log("15. 투자 가능 금액", availableCash);
            const targetPrice = (yield alpaca.getLatestTrade(targetSymbol)).Price;
            console.log("16. 목표 자산 가격", targetPrice);
            const targetQuantity = Math.floor(availableCash / targetPrice);
            console.log("17. 투자 수량", targetQuantity);
            try {
                console.log(`18. ${targetSymbol} 주문 시작`);
                yield alpaca.createOrder({
                    symbol: targetSymbol,
                    qty: targetQuantity,
                    side: "buy",
                    type: "market",
                    time_in_force: "gtc",
                });
            }
            catch (err) {
                console.log(`18. ${targetSymbol} 주문 중 에러 발생`, err);
            }
        }
        catch (_err) {
            const err = _err;
            console.error("6. Dual Momentum 전략 중 에러 발생", err);
        }
    });
}
