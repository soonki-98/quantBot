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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fetchAllData;
const alphavantage_1 = __importDefault(require("alphavantage"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SYMBOLS = ["SPY", "EFA", "BIL"];
const alpha = (0, alphavantage_1.default)({
    key: (_a = process.env.NODE_ALPHA_VANTAGE_API_KEY) !== null && _a !== void 0 ? _a : "",
});
function getMonthlyData() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("2. 월별 데이터 수집 시작");
        try {
            const monthlyResult = yield Promise.all(SYMBOLS.map((symbol) => alpha.data.monthly(symbol)));
            console.log("3. 월별 데이터 수집 완료");
            const result = {
                SPY: {},
                EFA: {},
                BIL: {},
            };
            console.log("4. SPY, EFA, BIL 별로 데이터 정리 시작");
            monthlyResult.forEach((data) => {
                result[data["Meta Data"]["2. Symbol"]] =
                    data["Monthly Time Series"];
            });
            console.log("5. SPY, EFA, BIL 별로 데이터 정리 완료");
            return result;
        }
        catch (error) {
            console.error("2. 월별 데이터 수집 중 에러 발생", error);
            throw error;
        }
    });
}
function fetchAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("1. 데이터 수집 시작");
        return yield getMonthlyData();
    });
}
