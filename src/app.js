import collectDatas from "./collectDatas.js";
import trade from "./trade.js";

collectDatas().then((data) => {
  trade(data);
});
