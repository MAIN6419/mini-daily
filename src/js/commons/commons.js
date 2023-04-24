'use strict';
import { calendar } from "./calendar.js";
import { updateTime } from "./clock.js";
import { changeLinks } from "./link.js";

// 모듈 함수들을 가져옴
updateTime();
setInterval(updateTime, 1000);
calendar();
changeLinks();