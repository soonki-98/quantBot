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
function filterDataByDate(data, startDate) {
    const filtered = {};
    for (const date in data["Monthly Time Series"]) {
        if (new Date(date) >= new Date(startDate)) {
            filtered[date] = data["Monthly Time Series"][date];
        }
    }
    return filtered;
}
// 특정 주식(AAPL)의 월간 데이터 가져오기
function getMonthlyData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const monthlyResult = yield Promise.all(SYMBOLS.map((symbol) => alpha.data.monthly(symbol)));
            const result = {
                SPY: {},
                EFA: {},
                BIL: {},
            };
            monthlyResult.forEach((data) => {
                result[data["Meta Data"]["2. Symbol"]] = filterDataByDate(data, "1970-01-01");
            });
            return result;
        }
        catch (error) {
            console.error(error);
        }
    });
}
// 특정 주식(AAPL)의 월간 데이터 가져오기
function fetchAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield getMonthlyData();
    });
}
