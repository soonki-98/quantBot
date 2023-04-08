import { scheduleJob } from "node-schedule";
import collectDatas from "./collectDatas.js";
import trade from "./trade.js";
import express from "express";

const app = express();

app.listen(3000, async () => {
  scheduleJob("0 0 12 30 * *", async () => {
    const data = await collectDatas();
    trade(data);
  });
});
