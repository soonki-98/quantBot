import collectDatas from "./collectDatas.js";
import trade from "./trade";

import dotenv from "dotenv";
dotenv.config();

collectDatas()
  .then((data) => {
    if (!data) {
      console.error("수집된 데이터가 없습니다.");
    }
    if (data) {
      trade(data);
    }
  })
  .catch((err) => {
    console.error(err);
  });
