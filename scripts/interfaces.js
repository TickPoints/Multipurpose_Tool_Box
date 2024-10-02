import * as mc from "@minecraft/server";
import * as tool from "./point.js";

import {
    OPToolButtonsReload,
    settingButtonsReload,
    toolButtonsReload,
    commandSystemRegReload,
    commandSystemReg,
    settingButtons,
    toolButtons,
    OPToolButtons,
    aboutUiShow,
    toolUiShow,
    OPToolUiShow,
    settingUiShow,
    commandSystemUiShow,
    UDUiShow,
    runcmd,
    SystemUser,
    commandSystemEventUseRequestUiShow
}
from "./Main.js";

import {
    data,
    debugMes,
    UDText
}
from "./data.js";

import {
    config
}
from "./config.js";

import {
    User
}
from "./user.js";

import {
    EventEngine
}
from "./eventEngine.js";
import * as commandSystem from "./CommandSystem/commandInterpreter.js";


function sendDataPack(id, data, uuid = tool.generateUUID(), otherData = {}) {
    function splitStringByLength(longStr) {
        const chunkSize = 1000; // 每个分段的长度
        let startIndex = 0;
        let result = [];
        while (startIndex < longStr.length) {
            result.push(longStr.substring(startIndex, startIndex + chunkSize));
            startIndex += chunkSize;
        };
        return result;
    };
    let pack = {
        "meta": {
            "version": data.version,
            "uuid": uuid,
            "id": "tool",
            "name": "tool"
        },
        "packData": data,
        "otherData": otherData
    };
    let packString = JSON.stringify(pack)
    if (packString.length > 1000) { // 分割字符串
        const packStringList = splitStringByLength(packString);
        const spaceUUID = tool.generateUUID();
        for (let i = 0; i < packStringList.length; i++) {
            let dataPack = {
                "type": "transmission",
                "space": spaceUUID,
                "data": packStringList[i]
            };
            if (i === 0) dataPack.type = "start";
            if (i === packStringList.length - 1) dataPack.type = "end";
            _send(id, JSON.stringify(dataPack));
        };
    } else {
        let dataPack = {
            "type": "all",
            "data": packString
        };
        _send(id, JSON.stringify(dataPack));
    };
};

function _send(id, message) {
    mc.world.getDimension("overworld").runCommand(`scriptevent ${id} ${message}`);
};

let _messagePackSpace = {};

function parseMessage(id, message) {
    let messagePack;
    try {
        messagePack = JSON.parse(message);
    } catch {
        tool.printErr(debugMes.interface.parseMessage.JSONParseError, "Debug", data.infoSource);
        return;
    };
    let dataPack;
    if (messagePack.type === null) {
        tool.printErr(debugMes.interface.parseMessage.messagePackError.typeError, "Debug", data.infoSource);
        return;
    };
    if (messagePack.data === null) {
        tool.printErr(debugMes.interface.parseMessage.messagePackError.dataError, "Debug", data.infoSource);
        return;
    };
    if (messagePack.type === "all") {
        dataPack = messagePack.data;
    } else {
        if (messagePack.space === null) {
            tool.printErr(debugMes.interface.parseMessage.messagePackError.spaceIdError, "Debug", data.infoSource);
            return;
        };
        switch (messagePack.type) {
            case "start":
                _messagePackSpace[messagePack.space] = [];
                _messagePackSpace[messagePack.space].push(messagePack.data);
                break;
            case "transmission":
                try {
                    _messagePackSpace[messagePack.space].push(messagePack.data);
                } catch {
                    tool.printErr(debugMes.interface.parseMessage.spaceError.spaceUninitialized, "Debug", data.infoSource);
                    return;
                };
                break;
            case "end":
                try {
                    _messagePackSpace[messagePack.space].push(messagePack.data);
                } catch {
                    tool.printErr(debugMes.interface.parseMessage.spaceError.spaceUninitialized, "Debug", data.infoSource);
                    return;
                };
                dataPack = "";
                for (let i of _messagePackSpace[messagePack.space]) {
                    dataPack += i;
                };
                _messagePackSpace[messagePack.space] = undefined;
                break;
            default:
                tool.printErr(debugMes.interface.parseMessage.messagePackError.typeError, "Debug", data.infoSource);
                return;
        };
    };
    if (dataPack == null) return;
    try {
        dataPack = JSON.parse(dataPack);
    } catch {
        tool.printErr(debugMes.interface.parseMessage.dataPackError.JSONParseError, "Debug", data.infoSource);
        return;
    };
    if (dataPack.meta == null) {
        tool.printErr(debugMes.interface.parseMessage.dataPackError.metaError.Uninitialized, "Debug", data.infoSource);
        return;
    };
    if (dataPack.meta.id == null) {
        tool.printErr(debugMes.interface.parseMessage.dataPackError.metaError.idUninitialized, "Debug", data.infoSource);
        return;
    };
    if (dataPack.packData == null) {
        tool.printErr(debugMes.interface.parseMessage.dataPackError.dataUninitialized, "Debug", data.infoSource);
        return;
    };
    loadInterface(id, dataPack);
};

mc.system.afterEvents.scriptEventReceive.subscribe(event => {
    if (event.sourceType !== "World")
        parseMessage(event.id, event.message);
}, {
    namespaces: ["toolAPI"]
});

mc.system.afterEvents.scriptEventReceive.subscribe(event => {
    switch (event.id) {
        case "tool:getHighestOP":
            if (!event.sourceType === "Entity") {
                return;
            };
            let player = event.sourceEntity;
            if (SystemUser.getData("has_hop")) {
                tool.printErr(debugMes.hopSetErr, "Info", data.infoSource, player);
                return;
            };
            let playerUser = User.getUser(player);
            playerUser.setLevel(5);
            tool.printErr(debugMes.hopSet, "Info", data.infoSource, player);
            SystemUser.setData("has_hop", true);
            break;
        case "tool:runcmd":
            if (event.sourceType !== "Server" && !config.commandSystem.eventUse.use) return;
            switch (event.sourceType) {
                case "Block":
                    runcmd(event.sourceBlock, event.message);
                    break;
                case "Entity":
                    let entity = event.sourceEntity;
                    if (entity.typeId === "minecraft:player") {
                        commandSystemEventUseRequestUiShow(entity, event.message);
                    } else {
                        runcmd(entity, event.message);
                    };
                    break;
                case "Server":
                    runcmd(mc.world, event.message);
                    break;
                case "NPCDialogue":
                    runcmd(event.sourceEntity, event.message);
                    break;
                default:
                    return;
            };
            break;
        default:
            return;
    };
}, {
    namespaces: ["tool"]
});

function loadInterface(id, dataPack) {
    let entry = _Interface[id.split(":")[1]];
    if (entry === undefined) {
        tool.printErr(tool.translationf(debugMes.interface.load.notFound, dataPack.meta.id, id.split(":")[1]), "Debug", dataPack.meta.name);
        return;
    };
    for (let i of Object.keys(entry.needData)) {
        if (i in dataPack.packData) {
            if (entry.needData[i] == null) continue;
            if (typeof dataPack.packData[i] !== entry.needData[i]) {
                tool.printErr(tool.translationf(debugMes.interface.load.objectTypeError, dataPack.meta.id, i, entry.needData[i]), "Debug", dataPack.meta.name);
                return;
            };
        } else {
            tool.printErr(tool.translationf(debugMes.interface.load.objectLost, dataPack.meta.id, i), "Debug", dataPack.meta.name);
            return;
        };
    };
    entry.func(dataPack.packData, dataPack.meta, dataPack.otherData);
};

function sendResult(uuid, message, type = "Info") {
    sendDataPack(`${uuid}:result`, {
        "type": type,
        "message": message
    });
};

function pathToObjectRef(obj, pathStr) {
    const pathArr = pathStr.split('.');
    let ref = obj;
    let lastObj = obj;
    let lastKey;
    for (let i = 0; i < pathArr.length; i++) {
        lastObj = ref;
        lastKey = pathArr[i];
        ref = ref[pathArr[i]];
        if (ref === undefined) {
            return undefined;
        };
    };
    return {
        obj: lastObj,
        key: lastKey
    };
};

function parseUser(data) {
    if (data.type === undefined) return null;
    switch (data.type) {
        case "Plugin":
            if (data.packId === undefined) return null;
            if (data.UserId === undefined) return null;
            return User.PluginUser.getUser(data.packId, data.UserId);
        case "System":
            return SystemUser;
        case "General":
            if (data.General === undefined) return null;
            let General = data.General;
            if (General.method === undefined) return null;
            switch (General.method) {
                case "name":
                    if (General.name === undefined) return null;
                    return User.getUser(General.name, "name");
                case "bind":
                    if (General.playerName === undefined) return null;
                    return User.getUser(tool.nameToPlayer(General.playerName));
                default:
                    return null;
            };
            break;
        default:
            return null;
    };
};

const _Interface = {
    "test": {
        "func": function(data, meta) {
            switch (data.RequestCode) {
                case 0:
                    console.warn("The test passed.");
                    break;
                case 1:
                    sendDataPack(`${meta.uuid}:testResult`, {
                        result: "The test passed."
                    });
                    break;
                default:
                    return;
            };
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "RequestCode": "number"
        }
    },
    "button.GeneralTool.add": {
        "func": function(data, meta) {
            toolButtons.push({
                name: data.buttonName,
                image: data.buttonImage,
                id: data.callbackId
            });
            toolButtonsReload();
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "buttonName": "string",
            "buttonImage": "string",
            "callbackId": "string"
        }
    },
    "button.OPTool.add": {
        "func": function(data, meta) {
            OPToolButtons.push({
                name: data.buttonName,
                image: data.buttonImage,
                id: data.callbackId
            });
            OPToolButtonsReload();
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "buttonName": "string",
            "buttonImage": "string",
            "callbackId": "string"
        }
    },
    "button.Setting.add": {
        "func": function(data, meta) {
            settingButtons.push({
                name: data.buttonName,
                image: data.buttonImage,
                id: data.callbackId
            });
            settingButtonsReload();
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "buttonName": "string",
            "buttonImage": "string",
            "callbackId": "string"
        }
    },
    "event.UDUiShowed.listen": {
        "func": function(data, meta) {
            EventEngine.listen("UDUiShowed", (eventData) => {
                sendDataPack(`${data.callbackId}:callback`, eventData);
            });
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "callbackId": "string"
        }
    },
    "event.SettingUiShowed.listen": {
        "func": function(data, meta) {
            EventEngine.listen("SettingUiShowed", (eventData) => {
                sendDataPack(`${data.callbackId}:callback`, eventData);
            });
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "callbackId": "string"
        }
    },
    "event.OPToolUiShowed.listen": {
        "func": function(data, meta) {
            EventEngine.listen("OPToolUiShowed", (eventData) => {
                sendDataPack(`${data.callbackId}:callback`, eventData);
            });
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "callbackId": "string"
        }
    },
    "event.ToolUiShowed.listen": {
        "func": function(data, meta) {
            EventEngine.listen("ToolUiShowed", (eventData) => {
                sendDataPack(`${data.callbackId}:callback`, eventData);
            });
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "callbackId": "string"
        }
    },
    "event.aboutUiShowed.listen": {
        "func": function(data, meta) {
            EventEngine.listen("aboutUiShowed", (eventData) => {
                sendDataPack(`${data.callbackId}:callback`, eventData);
            });
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "callbackId": "string"
        }
    },
    "event.menuUiShowed.listen": {
        "func": function(data, meta) {
            EventEngine.listen("menuUiShowed", (eventData) => {
                sendDataPack(`${data.callbackId}:callback`, eventData);
            });
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "callbackId": "string"
        }
    },
    "event.commandReg.listen": {
        "func": function(data, meta) {
            EventEngine.listen("commandReg", (eventData) => {
                sendDataPack(`${data.callbackId}:callback`, eventData);
            });
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "callbackId": "string"
        }
    },
    "ui.show": {
        "func": function(data, meta) {
            let player = tool.nameToPlayer(data.triggerName);
            switch (uiName) {
                case "aboutUi":
                    aboutUiShow(player);
                    break;
                case "toolUi":
                    toolUiShow(player);
                    break;
                case "OPToolUi":
                    OPToolUiShow(player);
                    break;
                case "settingUi":
                    settingUiShow(player);
                    break;
                case "commandSystemUi":
                    commandSystemUiShow(player);
                    break;
                case "UDUi":
                    UDUiShow(player);
                    break;
                default:
                    return;
            };
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "triggerName": "string",
            "uiName": "string"
        }
    },
    "user.PluginUser.new": {
        "func": function(data, meta) {
            let user = new User.PluginUser(meta.id, data.UserId);
            sendResult(meta.uuid, "Load Pass.", "Pass");
            EventEngine.trigger("PluginUserBeCreated", {
                "source": meta,
                "UserId": data.UserId
            });
        },
        "needData": {
            "UserId": "string"
        }
    },
    "user.PluginUser.sendMail": {
        "func": function(data, meta) {
            let user = User.PluginUser.getUser(meta.id, data.UserId);
            if (user === null) {
                sendResult(meta.uuid, "UserData not found.", "Error");
                return;
            };
            let targetUser = parseUser(data.TargetUser);
            if (targetUser === null) {
                sendResult(meta.uuid, "TargetUserData not found.", "Error");
                return;
            };
            user.sendMail(targetUser, data.Mail, data.UUID);
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "UserId": "string",
            "TargetUser": "object",
            "Mail": "string"
        }
    },
    "user.PluginUser.getData": {
        "func": function(data, meta) {
            // 实验性 Experiment
            let user = User.PluginUser.getUser(meta.id, data.UserId);
            if (user === null) {
                sendResult(meta.uuid, "UserData not found.", "Error");
                return;
            };
            sendDataPack(`${meta.uuid}:userData`, user.getData());
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "UserId": "string"
        }
    },
    "user.PluginUser.addLog": {
        "func": function(data, meta) {
            // 实验性 Experiment
            let user = User.PluginUser.getUser(meta.id, data.UserId);
            if (user === null) {
                sendResult(meta.uuid, "UserData not found.", "Error");
                return;
            };
            user.addLog(data.LogName, data.LogMessage);
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "UserId": "string",
            "LogName": "string",
            "LogMessage": "string"
        }
    },
    "user.PluginUser.setName": {
        "func": function(data, meta) {
            // 实验性 Experiment
            let user = User.PluginUser.getUser(meta.id, data.UserId);
            if (user === null) {
                sendResult(meta.uuid, "UserData not found.", "Error");
                return;
            };
            user.data.name = data.name;
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "UserId": "string",
            "name": "string"
        }
    },
    "user.PluginUser.setData": {
        "func": function(data, meta) {
            // 实验性 Experiment
            let user = User.PluginUser.getUser(meta.id, data.UserId);
            if (user === null) {
                sendResult(meta.uuid, "UserData not found.", "Error");
                return;
            };
            user.data = data.data;
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "UserId": "string",
            "data": "object"
        }
    },
    "user.User.isAvailable": {
        "func": function(data, meta) {
            if (parseUser(data.UserData) === null) {
                sendResult(meta.uuid, "UserData is invalid.", "Error");
            } else {
                sendResult(meta.uuid, "Load Pass.", "Pass");
            };
        },
        "needData": {
            "UserData": "object"
        }
    },
    "System.commandSystem.registr": {
        "func": function(data, meta) {
            if (!config.systemPlugins.includes(meta.id)) {
                sendResult(meta.uuid, "No system level permission.", "Error");
                return;
            };
            commandSystemReg.push(data.commands);
            commandSystemRegReload();
            EventEngine.trigger("commandReg", {
                "source": meta,
                "commands": data.commands
            });
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "commands": "object"
        }
    },
    "System.commandSystem.setRunCmdJob": {
        "func": function(data, meta) {
            // 实验性 Experiment
            if (!config.systemPlugins.includes(meta.id)) {
                sendResult(meta.uuid, "No system level permission.", "Error");
                return;
            };
            // 污染警告 Pollution Warning
            runcmd = eval(data.jobData);
            EventEngine.trigger("runCmdJobBeSet", {
                "source": meta,
                "jobData": data.jobData
            });
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "jobData": "string"
        }
    },
    "System.config.get": {
        "func": function(data, meta) {
            // 实验性 Experiment
            if (!config.systemPlugins.includes(meta.id)) {
                sendResult(meta.uuid, "No system level permission.", "Error");
                return;
            };
            let value = pathToObjectRef(config, data.path);
            if (value === undefined) {
                sendResult(meta.uuid, "Data is not defined.", "Error");
            };
            sendDataPack(`${meta.uuid}:configData`, {
                result: value.obj[value.key]
            });
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "path": "string"
        }
    },
    "System.config.set": {
        "func": function(data, meta) {
            // 实验性 Experiment
            if (!config.systemPlugins.includes(meta.id)) {
                sendResult(meta.uuid, "No system level permission.", "Error");
                return;
            };
            let value = pathToObjectRef(config, data.path);
            if (value === undefined) {
                sendResult(meta.uuid, "Data is not defined.", "Error");
            };
            value.obj[value.key] = data.value;
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "path": "string",
            "value": null
        }
    },
    "System.EventEngine.listen": {
        "func": function(data, meta) {
            // 实验性 Experiment
            if (!config.systemPlugins.includes(meta.id)) {
                sendResult(meta.uuid, "No system level permission.", "Error");
                return;
            };
            EventEngine.listen(data.id, (eventData) => {
                sendDataPack(`${data.callbackId}:callback`, eventData);
            });
            sendResult(meta.uuid, "Load Pass.", "Pass");
        },
        "needData": {
            "callbackId": "string",
            "id": "string"
        }
    }
};

mc.world.afterEvents.worldInitialize.subscribe(async () => {
    _send("toolBroadcast:initialize");
    await mc.system.waitTicks(5);
    _send("toolBroadcast:load");
});

export {
    sendDataPack
};