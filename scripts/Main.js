// 导入
import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import * as tool from "./point.js";
import * as commandSystem from "./CommandSystem/commandInterpreter.js";

import "./loader.js";

import {
    data,
    debugMes,
    UDText,
    LicenseText
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

import {
    sendDataPack
}
from "./interfaces.js";

let SystemUser;
let toolButtons = [];
let OPToolButtons = [];
let settingButtons = [];
let commandSystemReg = [];

const menuUI = new ui.ActionFormData()
    .title(data.menu.ui.title)
    .body(data.menu.ui.body)
    .button(data.menu.ui.button[0].name, data.menu.ui.button[0].image)
    .button(data.menu.ui.button[1].name, data.menu.ui.button[1].image)
    .button(data.menu.ui.button[2].name, data.menu.ui.button[2].image)
    .button(data.menu.ui.button[3].name, data.menu.ui.button[3].image);
const aboutUI = new ui.ActionFormData()
    .title(data.about.ui.title)
    .body(data.about.ui.body)
    .button(data.about.ui.button[0].name, data.about.ui.button[0].image)
    .button(data.about.ui.button[1].name, data.about.ui.button[1].image)
    .button(data.about.ui.button[2].name, data.about.ui.button[2].image)
    .button(data.about.ui.button[3].name, data.about.ui.button[3].image);
const builtInToolUI = new ui.ActionFormData()
    .title(data.builtIn.ui.title)
    .body(data.builtIn.ui.body)
    .button(data.builtIn.ui.button[0].name, data.builtIn.ui.button[0].image)
    .button(data.builtIn.ui.button[1].name, data.builtIn.ui.button[1].image)
    .button(data.builtIn.ui.button[2].name, data.builtIn.ui.button[2].image);

let toolUI = new ui.ActionFormData()
    .title(data.tool.ui.title)
    .body(data.tool.ui.debug)
    .button(data.tool.ui.button[0].name, data.tool.ui.button[0].image);
let OPToolUI = new ui.ActionFormData()
    .title(data.OPTool.ui.title)
    .body(data.OPTool.ui.debug)
    .button(data.OPTool.ui.button[0].name, data.OPTool.ui.button[0].image);
let settingUI = new ui.ActionFormData()
    .title(data.setting.ui.title)
    .body(data.setting.ui.mes)
    .button(data.setting.ui.button[0].name, data.setting.ui.button[0].image);

var runcmd = function(player, com) {
    return commandSystem.parseCommand(player, com);
};

function commandSystemRegReload() {
    commandSystem.reload();
    if (commandSystemReg === []) return;
    for (let i of commandSystemReg) {
        Object.keys(i)
            .forEach(key => {
                commandSystem.interpreter[key] = i[key];
            });
    };
};

function toolButtonsReload() {
    toolUI = new ui.ActionFormData()
        .title(data.tool.ui.title)
        .body(data.tool.ui.mes);
    for (let i of toolButtons) {
        toolUI.button(i.name, i.image);
    };
    toolUI.button(data.tool.ui.button[0].name, data.tool.ui.button[0].image);
};

function settingButtonsReload() {
    settingUI = new ui.ActionFormData()
        .title(data.setting.ui.title)
        .body(data.setting.ui.mes);
    for (let i of settingButtons) {
        settingUI.button(i.name, i.image);
    };
    settingUI.button(data.setting.ui.button[0].name, data.setting.ui.button[0].image);
};

function OPToolButtonsReload() {
    OPToolUI = new ui.ActionFormData()
        .title(data.tool.ui.title)
        .body(data.tool.ui.mes);
    for (let i of OPToolButtons) {
        OPToolUI.button(i.name, i.image);
    };
    OPToolUI.button(data.OPTool.ui.button[0].name, data.OPTool.ui.button[0].image);
};

function UDUIShow(player) {
    EventEngine.trigger("UDUIShowed", {
        "sourceName": player.name
    });
    const UDUI = new ui.MessageFormData()
        .title(data.UD.ui.title)
        .body(UDText)
        .button1(data.UD.ui.button[0])
        .button2(data.UD.ui.button[1]);
    UDUI.show(player)
        .then(r => {
            if (r.selection === 1) {
                aboutUIShow(player);
            };
            return;
        });
};

function LicenseUIShow(player) {
    EventEngine.trigger("LicenseUIShowed", {
        "sourceName": player.name
    });
    const LicenseUI = new ui.MessageFormData()
        .title(data.License.ui.title)
        .body(LicenseText)
        .button1(data.License.ui.button[0])
        .button2(data.License.ui.button[1]);
    LicenseUI.show(player)
        .then(r => {
            if (r.selection === 1) {
                aboutUIShow(player);
            };
            return;
        });
};

function commandSystemUIShow(player) {
    EventEngine.trigger("commandSystemUIShowed", {
        "sourceName": player.name
    });
    let commandSystemUI = new ui.ModalFormData()
        .title(data.commandSystem.ui.title)
        .textField(data.commandSystem.ui.textField[0].name, data.commandSystem.ui.textField[0].text)
        .submitButton(data.commandSystem.ui.submitButton.name);
    commandSystemUI.show(player)
        .then(r => {
            if (r.canceled) {
                aboutUIShow(player);
                return;
            };
            runcmd(player, r.formValues[0]);
            return;
        });
};

function settingUIShow(player) {
    EventEngine.trigger("SettingUIShowed", {
        "sourceName": player.name
    });
    settingUI.show(player)
        .then(r => {
            if (r.canceled) {
                aboutUIShow(player);
                return;
            };
            if (settingButtons !== []) {
                if (settingButtons[r.selection] === undefined) return;
                sendDataPack(`${settingButtons[r.selection].id}:callback`, {
                    sourceName: player.name
                });
            };
        });
};

function OPToolUIShow(player) {
    EventEngine.trigger("OPToolUIShowed", {
        "sourceName": player.name
    });
    OPToolUI.show(player)
        .then(r => {
            if (r.canceled) {
                menuUIShow(player);
                return;
            };
            if (OPToolButtons !== []) {
                if (OPToolButtons[r.selection] === undefined) return;
                sendDataPack(`${OPToolButtons[r.selection].id}:callback`, {
                    sourceName: player.name
                });
            };
        });
};

function toolUIShow(player) {
    EventEngine.trigger("ToolUIShowed", {
        "sourceName": player.name
    });
    toolUI.show(player)
        .then(r => {
            if (r.canceled) {
                menuUIShow(player);
                return;
            };
            if (toolButtons !== []) {
                if (toolButtons[r.selection] === undefined) return;
                sendDataPack(`${toolButtons[r.selection].id}:callback`, {
                    sourceName: player.name
                });
            };
        });
};

function aboutUIShow(player) {
    EventEngine.trigger("aboutUIShowed", {
        "sourceName": player.name
    });
    aboutUI.show(player)
        .then(r => {
            if (r.canceled) {
                menuUIShow(player);
                return;
            };
            switch (r.selection) {
                case 0:
                    UDUIShow(player);
                    break;
                case 1:
                    LicenseUIShow(player);
                    break;
                case 2:
                    commandSystemUIShow(player);
                    break;
                case 3:
                    if (!User.getUser(player).reachLevel(5)) {
                        tool.printErr(debugMes.hopUIErr, "Warn", data.infoSource, player);
                        return;
                    };
                    settingUIShow(player);
                    break;
                default:
                    return;
            };
        });
};

function builtInToolUIShow(player) {
    EventEngine.trigger("builtInToolUIShowed", {
        "sourceName": player.name
    });
    builtInToolUI.show(player)
        .then(r => {
            if (r.canceled) {
                menuUIShow(player);
                return;
            };
            switch (r.selection) {
                case 0:
                    handleMailServices(player);
                    break;
                case 1:
                    permissionManagement(player);
                    break;
                case 2:
                    logUIShow(player);
                    break;
                case 3:
                    break;
                default:
                    return;
            };
        });
};

function menuUIShow(player) {
    EventEngine.trigger("menuUIShowed", {
        "sourceName": player.name
    });
    menuUI.show(player)
        .then(r => {
            if (r.canceled) return;
            switch (r.selection) {
                case 0:
                    toolUIShow(player);
                    break;
                case 1:
                    if (!User.getUser(player).reachLevel(3)) {
                        tool.printErr(debugMes.op.ui.openErr, "Warn", data.logInfoSource, player);
                        SystemUser.addLog(new Date().toString(), debugMes.op.ui.openErr);
                        return;
                    };
                    OPToolUIShow(player);
                    break;
                case 2:
                    builtInToolUIShow(player);
                    break;
                case 3:
                    aboutUIShow(player);
                    break;
                default:
                    return;
            };
        });
};

// Partition 分割
function askUIShow(player, title = "askUI", body = "Are you sure?", button1 = "Yes", button2 = "no") {
    let askUI = new ui.MessageFormData()
        .title(title)
        .body(body)
        .button1(button1)
        .button2(button2);
    return new Promise((resolve, reject) => {
        askUI.show(player).then(async r => {
            switch (r.selection) {
                case 0:
                    resolve(true);
                    break;
                case 1:
                    resolve(false);
                    break;
                case undefined:
                    let data = await askUIShow(player, title, body, button1, button2);
                    resolve(data);
                    break;
                default:
                    return;
            };
        });
    });
};

function multiIineTextEditingUIShow(player, list = [""]) {
    let multiIineTextEditingUI = new ui.ModalFormData()
        .title(data.builtIn.multiIineTextEditing.ui.title)
        .toggle(data.builtIn.multiIineTextEditing.ui.toggle[0].name, false);
    for (let i = 0; i < list.length; i++) {
        multiIineTextEditingUI.textField(tool.translationf(data.builtIn.multiIineTextEditing.ui.textField[0].name, i + 1), data.builtIn.multiIineTextEditing.ui.textField[0].text, list[i]);
    };
    multiIineTextEditingUI.slider(data.builtIn.multiIineTextEditing.ui.slider[0].name, data.builtIn.multiIineTextEditing.ui.slider[0].min, data.builtIn.multiIineTextEditing.ui.slider[0].max, data.builtIn.multiIineTextEditing.ui.slider[0].valueStep, data.builtIn.multiIineTextEditing.ui.slider[0].defaultValue);
    multiIineTextEditingUI.submitButton(data.builtIn.multiIineTextEditing.ui.submit);
    return new Promise((resolve, reject) => {
        multiIineTextEditingUI.show(player).then(async r => {
            let data = "";
            if (r.canceled) {
                data = await multiIineTextEditingUIShow(player, list);
            };
            let stringList = r.formValues.slice(1, r.formValues.length - 1);
            if (r.formValues[0] === true) {
                for (let i of stringList) {
                    data = data + i + "\n";
                };
            } else {
                let line = r.formValues[r.formValues.length - 1];
                for (let i = 0; i < line; i++) {
                    stringList.push("");
                };
                data = await multiIineTextEditingUIShow(player, stringList);
            };
            resolve(data);
        });
    });
};

// Partition 分割
mc.world.beforeEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId === "tool:menu") {
        mc.system.run(() => {
            menuUIShow(event.source);
        });
    };
});

mc.world.afterEvents.worldInitialize.subscribe(worldInitialize);
mc.world.afterEvents.playerSpawn.subscribe(playerSpawn);
mc.world.beforeEvents.chatSend.subscribe(chatSendBeforeEvent);

function chatSendBeforeEvent(event) {
    let message = event.message;
    if (message[0] !== config.commandSystem.chat.id) return;
    let player = event.sender;
    event.cancel = true;
    mc.system.run(() => {
        runcmd(player, message.substring(1));
    });
};

async function playerSpawn(event) {
    let player = event.player;
    let playerUser = User.getUser(player);
    if (playerUser === null) {
        UserDataReset.resetPlayerUser(player);
    };
    playerUser = User.getUser(player);
    if (config.user.limitName.use && `Player-${player.name}` !== playerUser.getName()) {
        playerUser.setName(`Player-${player.name}`);
    };
    playerUser.setData("commandSystemEventUseTime", new Date().getTime());
    (function sendUpDataMail() {
        if (!config.updata.tipMail.receive) {
            return;
        };
        if (!playerUser.getData("viewed_update_tip").tip.includes(data.version.code)) {
            SystemUser.sendMail(playerUser, data.version.uptip);
            let viewed_update_tip = playerUser.getData("viewed_update_tip");
            viewed_update_tip.tip.push(data.version.code);
            playerUser.setData("viewed_update_tip", viewed_update_tip);
            tool.printErr(data.builtIn.mailServices.uptip, "Info", data.builtIn.mailServices.source, player);
        };
    })();
};

function worldInitialize(event) {
    SystemUser = User.getUser(mc.world);
    if (SystemUser === null) {
        UserDataReset.resetSystemUser();
    };
};

// UserData重置
const UserDataReset = {
    resetSystemUser: function() {
        SystemUser = new User("SystemUser", 6);
        SystemUser.bind(mc.world);
        SystemUser.setData("has_hop", false);
        SystemUser.setData("mailbox", {
            "box": {
                "receive": [],
                "send": []
            }
        });
        SystemUser.setData("log", {
            "logs": []
        });
    },
    resetPlayerUser: function(player) {
        let playerUser = new User(`Player-${player.name}`, 1);
        playerUser.bind(player);
        playerUser.setData("mailbox", {
            "box": {
                "receive": [],
                "send": []
            }
        });
        playerUser.setData("hide_permissions_view", false);
        playerUser.setData("viewed_update_tip", {
            "tip": []
        });
    }
};

// builtInTool
function handleMailServices(player) {
    let handleMailUI = new ui.ActionFormData()
        .title(data.builtIn.mailServices.ui.title)
        .body(data.builtIn.mailServices.ui.body)
        .button(data.builtIn.mailServices.ui.button[0].name, data.builtIn.mailServices.ui.button[0].image)
        .button(data.builtIn.mailServices.ui.button[1].name, data.builtIn.mailServices.ui.button[1].image);
    handleMailUI.show(player).then(r => {
        if (r.canceled) {
            builtInToolUIShow(player);
            return;
        };
        switch (r.selection) {
            case 0:
                SendMailUIShow(player);
                break;
            case 1:
                IncomingMailUIShow(player);
                break;
            default:
                return;
        };
    });
};
async function SendMailUIShow(player) {
    let target = await tool.chPlayer(player, data.builtIn.mailServices.chPlayer.title);
    if (target === false) {
        handleMailServices(player);
        return;
    };
    let text = await multiIineTextEditingUIShow(player);
    let askReturn = await askUIShow(player, data.builtIn.mailServices.ask.title, tool.translationf(data.builtIn.mailServices.ask.body, target.name, text));
    if (askReturn === true) {
        tool.printErr(data.builtIn.mailServices.send.player, "Info", data.builtIn.mailServices.source, player);
        tool.printErr(tool.translationf(data.builtIn.mailServices.send.target, target.name), "Info", data.builtIn.mailServices.source, target);
        User.getUser(player).sendMail(User.getUser(target), text);
    };
};

async function IncomingMailUIShow(player) {
    let IncomingMailUI = new ui.ActionFormData()
        .title(data.builtIn.mailServices.IncomingMail.ui.title)
        .body(data.builtIn.mailServices.IncomingMail.ui.body);
    let operationUI = new ui.ActionFormData()
        .title(data.builtIn.mailServices.IncomingMail.operationUI.title)
        .button(data.builtIn.mailServices.IncomingMail.operationUI.button[0].name, data.builtIn.mailServices.IncomingMail.operationUI.button[0].image)
        .button(data.builtIn.mailServices.IncomingMail.operationUI.button[1].name, data.builtIn.mailServices.IncomingMail.operationUI.button[1].image);
    let mailbox = User.getUser(player).getData("mailbox").box.receive;
    if (mailbox.length === 0) {
        tool.printErr(data.builtIn.mailServices.IncomingMail.tip, "Info", data.builtIn.mailServices.source, player);
        return;
    };
    for (let i of mailbox) {
        IncomingMailUI.button(tool.translationf(data.builtIn.mailServices.IncomingMail.ui.button, i.SourceName, i.Uuid));
    };
    IncomingMailUI.show(player).then(r => {
        if (r.canceled) {
            handleMailServices(player);
            return;
        };
        let mail = mailbox[r.selection];
        operationUI.body(tool.translationf(data.builtIn.mailServices.IncomingMail.operationUI.body, mail.SourceName, mail.TargetName, mail.Message, mail.Date, mail.Uuid));
        operationUI.show(player).then(r => {
            if (r.canceled) {
                IncomingMailUIShow(player);
                return;
            };
            switch (r.selection) {
                case 0:
                    SendMailUIShow(player);
                    break;
                case 1:
                    mailbox = User.getUser(player).getData("mailbox");
                    for (let i = 0; i < mailbox.box.receive.length; i++) {
                        if (mailbox.box.receive[i].Uuid === mail.Uuid) {
                            mailbox.box.receive.splice(i, 1);
                            User.getUser(player).setData("mailbox", mailbox);
                        };
                    };
                    break;
                default:
                    return;
            };
        });
    });
};

async function permissionManagement(player) {
    let target = await tool.chPlayer(player, data.builtIn.permissionManagement.chPlayer.title);
    if (target === false) {
        builtInToolUIShow(player);
        return;
    };
    let PlayerUser = User.getUser(player);
    let TargetUser = User.getUser(target);
    if (TargetUser.getData("hide_permissions_view") && (!PlayerUser.reachLevel(TargetUser.getLevel())) && player !== target) {
        tool.printErr(data.builtIn.permissionManagement.noright, "Warn", data.infoSource, player);
        return;
    };
    // Partition 分割
    let permissionManagementUI = new ui.ModalFormData()
        .title(data.builtIn.permissionManagement.ui.title)
        .slider(data.builtIn.permissionManagement.ui.slider[0].name, data.builtIn.permissionManagement.ui.slider[0].min, data.builtIn.permissionManagement.ui.slider[0].max, data.builtIn.permissionManagement.ui.slider[0].valueStep, TargetUser.getLevel())
        .toggle(data.builtIn.permissionManagement.ui.toggle[0].name, TargetUser.getData("hide_permissions_view"))
        .submitButton(data.builtIn.permissionManagement.ui.submit);
    permissionManagementUI.show(player).then(r => {
        if (r.canceled) {
            builtInToolUIShow(player);
            return;
        };
        if (!PlayerUser.reachLevel(TargetUser.getLevel())) {
            tool.printErr(data.builtIn.permissionManagement.noright, "Warn", data.infoSource, player);
            return;
        };
        if (!PlayerUser.reachLevel(r.formValues[0])) {
            tool.printErr(data.builtIn.permissionManagement.failureRaiseRight, "Warn", data.infoSource, player);
        } else if (TargetUser.getLevel() !== r.formValues[0]) {
            TargetUser.setLevel(r.formValues[0]);
            tool.printErr(data.builtIn.permissionManagement.operationSuccessful[0], "Info", data.infoSource, player);
        };
        if (TargetUser.getData("hide_permissions_view") !== r.formValues[1]) {
            TargetUser.setData("hide_permissions_view", r.formValues[1]);
            tool.printErr(data.builtIn.permissionManagement.operationSuccessful[1], "Info", data.infoSource, player);
        };
    });
};

// log 日志
async function logUIShow(player) {
    let logs = SystemUser.getData("log").logs;
    let logUI = new ui.ActionFormData()
        .title(data.builtIn.log.ui.title)
        .body(data.builtIn.log.ui.body);
    logUI.button(data.builtIn.log.ui.button[0].name);
    for (let i of logs) {
        logUI.button(tool.translationf(data.builtIn.log.ui.button[1].name, i.Name));
    };
    logUI.show(player).then(r => {
        if (r.canceled) {
            builtInToolUIShow(player);
            return;
        };
        if (r.selection === 0) {
            addLogUIShow(player);
            return;
        };
        let targetLog = logs[r.selection - 1];
        let operationUI = new ui.ActionFormData()
            .title(data.builtIn.log.operationUI.title)
            .body(tool.translationf(data.builtIn.log.operationUI.body, targetLog.Name, targetLog.Message, targetLog.Recorder, targetLog.Date, targetLog.Uuid))
            .button(data.builtIn.log.operationUI.button[0].name, data.builtIn.log.operationUI.button[0].image);
        operationUI.show(player).then(r => {
            if (r.canceled) {
                logUIShow(player);
                return;
            };
            switch (r.selection) {
                case 0:
                    logs = SystemUser.getData("log");
                    for (let i = 0; i < logs.logs.length; i++) {
                        if (logs.logs[i].Uuid === targetLog.Uuid) {
                            logs.logs.splice(i, 1);
                            SystemUser.setData("log", logs);
                        };
                    };
                    break;
                default:
                    return;
            };
        });
    });
};

async function addLogUIShow(player) {
    let text = await multiIineTextEditingUIShow(player, ["Log", data.builtIn.log.add.tip]);
    try {
        text = text.split("\n", 2);
    } catch {
        tool.printErr(data.builtIn.log.add.error, "Error", data.logInfoSource, player);
        SystemUser.addLog(new Date().toString(), data.builtIn.log.add.error);
        return;
    };
    User.getUser(player).addLog(text[0], text[1]);
    tool.printErr(data.builtIn.log.add.info, "Info", data.infoSource, player);
    logUIShow(player);
};

async function commandSystemEventUseRequestUIShow(player, message) {
    if (!config.commandSystem.eventUse.UIRequest.use) return;
    let playerUser = User.getUser(player);
    let useTime = playerUser.getData("commandSystemEventUseTime");
    const currentTime = new Date().getTime();
    if ((currentTime - useTime) <= (config.commandSystem.eventUse.UIRequest.requestPostpone * 1000)) return;
    let result = await askUIShow(player, data.commandSystem.eventUse.ui.title, data.commandSystem.eventUse.ui.body);
    playerUser.setData("commandSystemEventUseTime", new Date().getTime());
    if (result) runcmd(player, message);
};

export {
    OPToolButtonsReload,
    settingButtonsReload,
    toolButtonsReload,
    commandSystemRegReload,
    commandSystemReg,
    settingButtons,
    toolButtons,
    OPToolButtons,
    aboutUIShow,
    toolUIShow,
    OPToolUIShow,
    settingUIShow,
    commandSystemUIShow,
    UDUIShow,
    runcmd,
    SystemUser,
    commandSystemEventUseRequestUIShow
};
// 导出