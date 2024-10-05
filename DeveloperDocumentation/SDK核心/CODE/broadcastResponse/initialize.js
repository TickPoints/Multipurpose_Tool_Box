import {
    system
}
from "@minecraft/server";

let funcs = [];

system.afterEvents.scriptEventReceive.subscribe(event => {
    if (event.id === "toolBroadcast:initialize") {
        for (let i of funcs) {
            i();
        };
    };
});
/**
 * 监听多用工具包初始化事件(此事件发生在load事件之前，约有5个滴答的延迟)
 * arg {Function} func - 回调函数
 */
function listen(func) {
    funcs.push(func)
}

export {
    listen
}