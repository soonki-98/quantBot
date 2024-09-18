import collectDatas from "./collectDatas.js";
import trade from "./trade";

import dotenv from "dotenv";
dotenv.config();

collectDatas()
  .then((data) => {
    if (data) {
      trade(data);
    }
  })
  .catch((err) => {
    console.error(err);
  });
