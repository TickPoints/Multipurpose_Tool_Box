// 工具 Tool
import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

/**
 * @typedef {(mc.world|mc.Entity)} DynamicPropertyObject
 * @typedef {("Info"|"Error"|"Warn"|"Debug")} LogLevel
 */

// 动态属性 DynamicProperty
/**
 * 读取动态属性值
 * @arg {string} id - 动态属性的Id
 * @arg {DynamicPropertyObject} type - 动态属性所在的对象
 * @returns {(string|mc.Vector|number|boolen)} 返回动态属性的值
 * @readonly
 */
function getData(id, type = mc.world) {
    var data;
    try {
        data = JSON.parse(type.getDynamicProperty(id));
    } catch {
        return null;
    };
    return data;
};
/**
 * 设置动态属性值
 * @arg {string} id - 动态属性的Id
 * @arg {(string|mc.Vector|number|boolen)} mes - 动态属性的值
 * @arg {DynamicPropertyObject} type - 动态属性所在的对象
 * @readonly
 */
function saveData(id, mes, type = mc.world) {
    try {
        type.getDynamicProperty(id);
    } catch {
        type.setDynamicProperty(id, "");
    };
    type.setDynamicProperty(id, JSON.stringify(mes));
};
/**
 * 对一个玩家展示一个选择玩家页面
 * @arg {mc.Player} player - 需要被展示的玩家
 * @arg {string} [title] - 展示页面的标题
 * @arg {string[]} dropdown - 选择组件的标题
 * @readonly
 */
function chPlayer(player, title = "Select a player", dropdown = "name") {
    return new Promise((resolve, reject) => {
        let list = getAllPlayersName();
        const chUi = new ui.ModalFormData()
            .title(title)
            .dropdown(dropdown, list);
        chUi.show(player)
            .then(r => {
                if (r.canceled) {
                    resolve(false);
                    return;
                };
                resolve(nameToPlayer(list[r.formValues]));
            })
            .
        catch(e => {
            console.error(e, e.stack);
        });
    });
};
/**
 * 输出报告
 * @arg {string} mes - 报告内容
 * @arg {LogLevel} [type] - 报告类型
 * @arg {string} [source] - 报告来源
 * @arg {(mc.Player|mc.world)} [target] - 报告对象
 * @readonly
 */
function printErr(mes, type = "Info", source = "PointSystem", target = mc.world) {
    let outputText;
    switch (type) {
        case "Warn":
            outputText = `[Warn][${source}]§6 ${mes}`;
            break;
        case "Info":
            outputText = `[Info][${source}]§b ${mes}`;
            break;
        case "Debug":
            outputText = `[Debug][${source}]§c ${mes}`;
            break;
        case "Error":
            outputText = `[Error][${source}]§4 ${mes}`;
            break;
        default:
            printErr("Not found the type", "Error");
    };
    try {
        target.sendMessage(outputText);
    } catch {
        mc.world.sendMessage(outputText);
    };
};
/**
 * 获取所有玩家的名称
 * returns {string[]} 返回所有玩家的名称
 * @readonly
 */
function getAllPlayersName() {
    let getAllPlayers_name = [];
    getAllPlayers_name = [];
    let namePushText = mc.world.getAllPlayers();
    let allPlayer = mc.world.getAllPlayers();
    for (var i = 0; i < allPlayer.length; i++) {
        getAllPlayers_name.push(namePushText[i].name);
    };
    return getAllPlayers_name;
};
/**
 * 从名称转到玩家对象
 * arg {string} - 玩家名称
 * returns {(mc.Player|null)} 如果玩家不存在返回null，否则正常返回玩家
 * @readonly
 */
function nameToPlayer(name) {
    let allPlayer = mc.world.getAllPlayers();
    for (var i of allPlayer) {
        if (i.name === name) {
            return i;
        };
    };
    return null;
};
/**
 * 给予玩家一个物品(就像"/give"指令一样)
 * @arg {mc.Player} player - 将被给予的玩家
 * @arg {mc.ItemStack} itemStack - 物品对象
 * @readonly
 */
function giveItem(player, itemStack) {
    const inventory = player.getComponent("minecraft:inventory");
    if (inventory === undefined || inventory.container === undefined) {
        return;
    };
    inventory.container.addItem(itemStack);
    return;
};
/**
 * 检测玩家是否带有物品
 * @arg {mc.Player} player - 将被检测的玩家
 * @arg {mc.ItemStack} itemStack - 物品对象
 * @returns {boolen} 检测结果
 * @readonly
 */
function hasItem(player, itemStack) {
    const inventory = player.getComponent("minecraft:inventory");
    if (inventory === undefined || inventory.container === undefined) {
        return false;
    };
    const container = inventory.container;
    let amount = 0;
    for (var i = 0; i < container.size; i++) {
        let item = container.getItem(i);
        if (!(item === undefined)) {
            if (item.isStackableWith(itemStack)) {
                amount = amount + item.amount;
            };
        };
    };
    if (amount >= itemStack.amount) {
        return true;
    } else {
        return false;
    };
};
/**
 * 清除玩家的物品(就像"/clear"指令一样)
 * @arg {mc.Player} player - 将被清除物品的玩家
 * @arg {mc.ItemStack} itemStack - 物品对象
 * @returns {boolen} 如果玩家没有物品或无法正常访问物品空间的话返回false，否则正常返回true
 * @readonly
 */
function clearItem(player, itemStack) {
    const inventory = player.getComponent("minecraft:inventory");
    if (inventory === undefined || inventory.container === undefined) {
        return false;
    };
    const container = inventory.container;
    let amount = itemStack.amount;
    for (var i = 0; i < container.size; i++) {
        let item = container.getItem(i);
        if (!(item === undefined)) {
            if (item.isStackableWith(itemStack)) {
                if (amount > item.amount) {
                    container.setItem(i, undefined);
                    amount = amount - item.amount;
                } else {
                    item.amount = item.amount - amount;
                    container.setItem(i, item);
                    return true;
                };
            };
        };
    };
    return false;
};
/**
 * 依照一个特殊的形式获取字符串的转义
 * @arg {string} message - 将被转移的原始字符串
 * @arg {...string} arg - 帮助转义的字符串
 * @returns {string} 转义后的字符串
 * @readonly
 */
function translationf(message, ...args) {
    if (message.includes("%%s")) {
        message = message.replace(/%%s/g, args[0]);
    } else {
        for (let i = 0; i < args.length; i++) {
            if (message.includes(`%%${i+1}`)) {
                message = message.replace(new RegExp(`%%${i+1}`, "g"), args[i]);
            };
        };
    };
    return message;
};
/**
 * 深度拷贝一个对象
 * @arg {Object} obj - 将要被拷贝的对象
 * @returns {Object} 深度拷贝完的对象
 * @readonly
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== "object") return obj;

    let clone = new obj.constructor();
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = deepClone(obj[key]);
        };
    };
    return clone;
};
/**
 * 生成一个UUID
 * @returns {string} 生成的UUID
 * @readonly
 */
function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export {
    getData,
    saveData,
    chPlayer,
    printErr,
    getAllPlayersName,
    nameToPlayer,
    giveItem,
    hasItem,
    clearItem,
    translationf,
    deepClone,
    generateUUID
};