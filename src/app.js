import collectDatas from "./collectDatas.js";
import trade from "./trade.js";
import express from "express";

const app = express();

app.listen(8080, async () => {
  try {
    const data = await collectDatas();
    trade(data);
  } catch (err) {
    console.log(err);
  }
});
