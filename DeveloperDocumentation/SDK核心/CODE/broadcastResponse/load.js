import {
    system
}
from "@minecraft/server";

let funcs = [];

system.afterEvents.scriptEventReceive.subscribe(event => {
    if (event.id === "toolBroadcast:load") {
        for (let i of funcs) {
            i();
        };
    };
});
/**
 * 监听多用工具包请求插件加载事件(此事件发生在initialize之后，约有5个滴答的延迟)
 * arg {Function} func - 回调函数
 */
function listen(func) {
    funcs.push(func)
}

export {
    listen
}