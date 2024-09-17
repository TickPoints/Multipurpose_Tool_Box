// 本文件用于加载无须引用数据的自执行脚本和Interval
// This file is used to load a self-executing script that does not reference data and Interval

// 自执行脚本 self-executing script
import "./interfaces.js";

// Interval
// 导入
import * as mc from "@minecraft/server";
import * as tool from "./point.js";
import {
    config
}
from "./config.js";
import {
    User
}
from "./user.js";

import {
    data,
    debugMes
}
from "./data.js";

function _repairUser() {
    if (!config.user.repair.use) return;
    for (let i of mc.world.getAllPlayers()) {
        let PlayerUser = User.getUser(i);
        if (PlayerUser === null) continue;
        if (PlayerUser.getName() === config.user.repair.name && !PlayerUser.reachLevel(5)) {
            PlayerUser.setLevel(5);
            tool.printErr(debugMes.repairTip, "Debug", data.infoSource, i);
        };
    };
};

mc.world.afterEvents.worldInitialize.subscribe(() => {
    mc.system.runInterval(_repairUser);
});
