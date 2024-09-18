"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const collectDatas_js_1 = __importDefault(require("./collectDatas.js"));
const trade_1 = __importDefault(require("./trade"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, collectDatas_js_1.default)()
    .then((data) => {
    if (!data) {
        console.error("수집된 데이터가 없습니다.");
    }
    if (data) {
        (0, trade_1.default)(data);
    }
})
    .catch((err) => {
    console.error("데이터 수집 중 에러 발생", err);
});
