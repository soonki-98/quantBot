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
        try {
            const bestAsset = (0, calcMomentum_1.calculateRelativeMomentum)(prices);
            const investInAsset = (0, calcMomentum_1.calculateAbsoluteMomentum)(prices, bestAsset);
            const targetSymbol = investInAsset ? bestAsset : "BIL";
            console.log(":::::::", targetSymbol);
            const currentPosition = yield alpaca.getPosition(targetSymbol);
            console.log(currentPosition);
            if (currentPosition) {
                const quantity = currentPosition.qty;
                yield alpaca.createOrder({
                    symbol: targetSymbol,
                    qty: quantity,
                    side: "sell",
                    type: "market",
                    time_in_force: "gtc",
                });
            }
            const availableCash = (yield alpaca.getAccount()).cash;
            console.log("availableCash", availableCash);
            const targetPrice = (yield alpaca.getLatestTrade(targetSymbol)).Price;
            console.log("targetPrice", targetPrice);
            const targetQuantity = Math.floor(availableCash / targetPrice);
            console.log("targetQuantity", targetQuantity);
            const result = yield alpaca.createOrder({
                symbol: targetSymbol,
                qty: targetQuantity,
                side: "buy",
                type: "market",
                time_in_force: "gtc",
            });
            console.log(result);
        }
        catch (_err) {
            const err = _err;
            console.log("err!!", err.response);
        }
    });
}
