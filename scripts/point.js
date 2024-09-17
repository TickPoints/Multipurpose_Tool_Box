// 工具 Tool
import * as mc from '@minecraft/server';
import * as ui from "@minecraft/server-ui";

// 动态属性 DynamicProperty
function getData(id, type = mc.world) {
    var data;
    try {
        data = JSON.parse(type.getDynamicProperty(id));
    } catch {
        return null;
    };
    return data;
};

function saveData(id, mes, type = mc.world) {
    try {
        type.getDynamicProperty(id);
    } catch {
        type.setDynamicProperty(id, "");
    };
    type.setDynamicProperty(id, JSON.stringify(mes));
};

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

function nameToPlayer(name) {
    let allPlayer = mc.world.getAllPlayers();
    for (var i of allPlayer) {
        if (i.name === name) {
            return i;
        };
    };
    return null;
};

function giveItem(player, itemStack) {
    const inventory = player.getComponent('minecraft:inventory');
    if (inventory === void 0 || inventory.container === void 0) {
        return;
    };
    inventory.container.addItem(itemStack);
    return;
};

function hasItem(player, itemStack) {
    const inventory = player.getComponent('minecraft:inventory');
    if (inventory === void 0 || inventory.container === void 0) {
        return false;
    };
    const container = inventory.container;
    let amount = 0;
    for (var i = 0; i < container.size; i++) {
        let item = container.getItem(i);
        if (!(item === void 0)) {
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

function clearItem(player, itemStack) {
    const inventory = player.getComponent('minecraft:inventory');
    if (inventory === void 0 || inventory.container === void 0) {
        return false;
    };
    const container = inventory.container;
    let amount = itemStack.amount;
    for (var i = 0; i < container.size; i++) {
        let item = container.getItem(i);
        if (!(item === void 0)) {
            if (item.isStackableWith(itemStack)) {
                if (amount > item.amount) {
                    container.setItem(i, void 0);
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

function translationf(...args) {
    let message = args[0];
    if (message.includes('%%s')) {
        message = message.replace(/%%s/g, args[1]);
    } else {
        for (let i = 1; i < args.length; i++) {
            if (message.includes(`%%${i}`)) {
                message = message.replace(new RegExp(`%%${i}`, 'g'), args[i]);
            };
        };
    };
    return message;
};

function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;

    let clone = new obj.constructor();
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = deepClone(obj[key]);
        };
    };
    return clone;
};

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
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