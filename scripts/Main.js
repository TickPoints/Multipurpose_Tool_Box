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

const menuUi = new ui.ActionFormData()
    .title(data.menu.ui.title)
    .body(data.menu.ui.body)
    .button(data.menu.ui.button[0].name, data.menu.ui.button[0].image)
    .button(data.menu.ui.button[1].name, data.menu.ui.button[1].image)
    .button(data.menu.ui.button[2].name, data.menu.ui.button[2].image)
    .button(data.menu.ui.button[3].name, data.menu.ui.button[3].image);
const aboutUi = new ui.ActionFormData()
    .title(data.about.ui.title)
    .body(data.about.ui.body)
    .button(data.about.ui.button[0].name, data.about.ui.button[0].image)
    .button(data.about.ui.button[1].name, data.about.ui.button[1].image)
    .button(data.about.ui.button[2].name, data.about.ui.button[2].image)
    .button(data.about.ui.button[3].name, data.about.ui.button[3].image);
const builtInToolUi = new ui.ActionFormData()
    .title(data.builtIn.ui.title)
    .body(data.builtIn.ui.body)
    .button(data.builtIn.ui.button[0].name, data.builtIn.ui.button[0].image)
    .button(data.builtIn.ui.button[1].name, data.builtIn.ui.button[1].image)
    .button(data.builtIn.ui.button[2].name, data.builtIn.ui.button[2].image);

let toolUi = new ui.ActionFormData()
    .title(data.tool.ui.title)
    .body(data.tool.ui.debug)
    .button(data.tool.ui.button[0].name, data.tool.ui.button[0].image);
let OPToolUi = new ui.ActionFormData()
    .title(data.OPTool.ui.title)
    .body(data.OPTool.ui.debug)
    .button(data.OPTool.ui.button[0].name, data.OPTool.ui.button[0].image);
let settingUi = new ui.ActionFormData()
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
    toolUi = new ui.ActionFormData()
        .title(data.tool.ui.title)
        .body(data.tool.ui.mes);
    for (let i of toolButtons) {
        toolUi.button(i.name, i.image);
    };
    toolUi.button(data.tool.ui.button[0].name, data.tool.ui.button[0].image);
};

function settingButtonsReload() {
    settingUi = new ui.ActionFormData()
        .title(data.setting.ui.title)
        .body(data.setting.ui.mes);
    for (let i of settingButtons) {
        settingUi.button(i.name, i.image);
    };
    settingUi.button(data.setting.ui.button[0].name, data.setting.ui.button[0].image);
};

function OPToolButtonsReload() {
    OPToolUi = new ui.ActionFormData()
        .title(data.tool.ui.title)
        .body(data.tool.ui.mes);
    for (let i of OPToolButtons) {
        OPToolUi.button(i.name, i.image);
    };
    OPToolUi.button(data.OPTool.ui.button[0].name, data.OPTool.ui.button[0].image);
};

function UDUiShow(player) {
    EventEngine.trigger("UDUiShowed", {
        "sourceName": player.name
    });
    const UDUi = new ui.MessageFormData()
        .title(data.UD.ui.title)
        .body(UDText)
        .button1(data.UD.ui.button[0])
        .button2(data.UD.ui.button[1]);
    UDUi.show(player)
        .then(r => {
            if (r.selection === 1) {
                aboutUiShow(player);
            };
            return;
        });
};

function LicenseUiShow(player) {
    EventEngine.trigger("LicenseUiShowed", {
        "sourceName": player.name
    });
    const LicenseUi = new ui.MessageFormData()
        .title(data.License.ui.title)
        .body(LicenseText)
        .button1(data.License.ui.button[0])
        .button2(data.License.ui.button[1]);
    LicenseUi.show(player)
        .then(r => {
            if (r.selection === 1) {
                aboutUiShow(player);
            };
            return;
        });
};

function commandSystemUiShow(player) {
    EventEngine.trigger("commandSystemUiShowed", {
        "sourceName": player.name
    });
    let commandSystemUi = new ui.ModalFormData()
        .title(data.commandSystem.ui.title)
        .textField(data.commandSystem.ui.textField[0].name, data.commandSystem.ui.textField[0].text)
        .submitButton(data.commandSystem.ui.submitButton.name);
    commandSystemUi.show(player)
        .then(r => {
            if (r.canceled) {
                aboutUiShow(player);
                return;
            };
            runcmd(player, r.formValues[0]);
            return;
        });
};

function settingUiShow(player) {
    EventEngine.trigger("SettingUiShowed", {
        "sourceName": player.name
    });
    settingUi.show(player)
        .then(r => {
            if (r.canceled) {
                aboutUiShow(player);
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

function OPToolUiShow(player) {
    EventEngine.trigger("OPToolUiShowed", {
        "sourceName": player.name
    });
    OPToolUi.show(player)
        .then(r => {
            if (r.canceled) {
                menuUiShow(player);
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

function toolUiShow(player) {
    EventEngine.trigger("ToolUiShowed", {
        "sourceName": player.name
    });
    toolUi.show(player)
        .then(r => {
            if (r.canceled) {
                menuUiShow(player);
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

function aboutUiShow(player) {
    EventEngine.trigger("aboutUiShowed", {
        "sourceName": player.name
    });
    aboutUi.show(player)
        .then(r => {
            if (r.canceled) {
                menuUiShow(player);
                return;
            };
            switch (r.selection) {
                case 0:
                    UDUiShow(player);
                    break;
                case 1:
                    LicenseUiShow(player);
                    break;
                case 2:
                    commandSystemUiShow(player);
                    break;
                case 3:
                    if (!User.getUser(player).reachLevel(5)) {
                        tool.printErr(debugMes.hopUiErr, "Warn", data.infoSource, player);
                        return;
                    };
                    settingUiShow(player);
                    break;
                default:
                    return;
            };
        });
};

function builtInToolUiShow(player) {
    EventEngine.trigger("builtInToolUiShowed", {
        "sourceName": player.name
    });
    builtInToolUi.show(player)
        .then(r => {
            if (r.canceled) {
                menuUiShow(player);
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
                    logUiShow(player);
                    break;
                case 3:
                    break;
                default:
                    return;
            };
        });
};

function menuUiShow(player) {
    EventEngine.trigger("menuUiShowed", {
        "sourceName": player.name
    });
    menuUi.show(player)
        .then(r => {
            if (r.canceled) return;
            switch (r.selection) {
                case 0:
                    toolUiShow(player);
                    break;
                case 1:
                    if (!User.getUser(player).reachLevel(3)) {
                        tool.printErr(debugMes.op.ui.openErr, "Warn", data.logInfoSource, player);
                        SystemUser.addLog(new Date().toString(), debugMes.op.ui.openErr);
                        return;
                    };
                    OPToolUiShow(player);
                    break;
                case 2:
                    builtInToolUiShow(player);
                    break;
                case 3:
                    aboutUiShow(player);
                    break;
                default:
                    return;
            };
        });
};

// Partition 分割
function askUiShow(player, title = "askUi", body = "Are you sure?", button1 = "Yes", button2 = "no") {
    let askUi = new ui.MessageFormData()
        .title(title)
        .body(body)
        .button1(button1)
        .button2(button2);
    return new Promise((resolve, reject) => {
        askUi.show(player).then(async r => {
            switch (r.selection) {
                case 0:
                    resolve(true);
                    break;
                case 1:
                    resolve(false);
                    break;
                case undefined:
                    let data = await askUiShow(player, title, body, button1, button2);
                    resolve(data);
                    break;
                default:
                    return;
            };
        });
    });
};

function multiIineTextEditingUiShow(player, list = [""]) {
    let multiIineTextEditingUi = new ui.ModalFormData()
        .title(data.builtIn.multiIineTextEditing.ui.title)
        .toggle(data.builtIn.multiIineTextEditing.ui.toggle[0].name, false);
    for (let i = 0; i < list.length; i++) {
        multiIineTextEditingUi.textField(tool.translationf(data.builtIn.multiIineTextEditing.ui.textField[0].name, i + 1), data.builtIn.multiIineTextEditing.ui.textField[0].text, list[i]);
    };
    multiIineTextEditingUi.slider(data.builtIn.multiIineTextEditing.ui.slider[0].name, data.builtIn.multiIineTextEditing.ui.slider[0].min, data.builtIn.multiIineTextEditing.ui.slider[0].max, data.builtIn.multiIineTextEditing.ui.slider[0].valueStep, data.builtIn.multiIineTextEditing.ui.slider[0].defaultValue);
    multiIineTextEditingUi.submitButton(data.builtIn.multiIineTextEditing.ui.submit);
    return new Promise((resolve, reject) => {
        multiIineTextEditingUi.show(player).then(async r => {
            let data = "";
            if (r.canceled) {
                data = await multiIineTextEditingUiShow(player, list);
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
                data = await multiIineTextEditingUiShow(player, stringList);
            };
            resolve(data);
        });
    });
};

// Partition 分割
mc.world.beforeEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId === "tool:menu") {
        mc.system.run(() => {
            menuUiShow(event.source);
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
    let handleMailUi = new ui.ActionFormData()
        .title(data.builtIn.mailServices.ui.title)
        .body(data.builtIn.mailServices.ui.body)
        .button(data.builtIn.mailServices.ui.button[0].name, data.builtIn.mailServices.ui.button[0].image)
        .button(data.builtIn.mailServices.ui.button[1].name, data.builtIn.mailServices.ui.button[1].image);
    handleMailUi.show(player).then(r => {
        if (r.canceled) {
            builtInToolUiShow(player);
            return;
        };
        switch (r.selection) {
            case 0:
                SendMailUiShow(player);
                break;
            case 1:
                IncomingMailUiShow(player);
                break;
            default:
                return;
        };
    });
};
async function SendMailUiShow(player) {
    let target = await tool.chPlayer(player, data.builtIn.mailServices.chPlayer.title);
    if (target === false) {
        handleMailServices(player);
        return;
    };
    let text = await multiIineTextEditingUiShow(player);
    let askReturn = await askUiShow(player, data.builtIn.mailServices.ask.title, tool.translationf(data.builtIn.mailServices.ask.body, target.name, text));
    if (askReturn === true) {
        tool.printErr(data.builtIn.mailServices.send.player, "Info", data.builtIn.mailServices.source, player);
        tool.printErr(tool.translationf(data.builtIn.mailServices.send.target, target.name), "Info", data.builtIn.mailServices.source, target);
        User.getUser(player).sendMail(User.getUser(target), text);
    };
};

async function IncomingMailUiShow(player) {
    let IncomingMailUi = new ui.ActionFormData()
        .title(data.builtIn.mailServices.IncomingMail.ui.title)
        .body(data.builtIn.mailServices.IncomingMail.ui.body);
    let operationUi = new ui.ActionFormData()
        .title(data.builtIn.mailServices.IncomingMail.operationUi.title)
        .button(data.builtIn.mailServices.IncomingMail.operationUi.button[0].name, data.builtIn.mailServices.IncomingMail.operationUi.button[0].image)
        .button(data.builtIn.mailServices.IncomingMail.operationUi.button[1].name, data.builtIn.mailServices.IncomingMail.operationUi.button[1].image);
    let mailbox = User.getUser(player).getData("mailbox").box.receive;
    if (mailbox.length === 0) {
        tool.printErr(data.builtIn.mailServices.IncomingMail.tip, "Info", data.builtIn.mailServices.source, player);
        return;
    };
    for (let i of mailbox) {
        IncomingMailUi.button(tool.translationf(data.builtIn.mailServices.IncomingMail.ui.button, i.SourceName, i.Uuid));
    };
    IncomingMailUi.show(player).then(r => {
        if (r.canceled) {
            handleMailServices(player);
            return;
        };
        let mail = mailbox[r.selection];
        operationUi.body(tool.translationf(data.builtIn.mailServices.IncomingMail.operationUi.body, mail.SourceName, mail.TargetName, mail.Message, mail.Date, mail.Uuid));
        operationUi.show(player).then(r => {
            if (r.canceled) {
                handleMailServices(player);
                return;
            };
            switch (r.selection) {
                case 0:
                    SendMailUiShow(player);
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
        builtInToolUiShow(player);
        return;
    };
    let PlayerUser = User.getUser(player);
    let TargetUser = User.getUser(target);
    if (TargetUser.getData("hide_permissions_view") && (!PlayerUser.reachLevel(TargetUser.getLevel())) && player !== target) {
        tool.printErr(data.builtIn.permissionManagement.noright, "Warn", data.infoSource, player);
        return;
    };
    // Partition 分割
    let permissionManagementUi = new ui.ModalFormData()
        .title(data.builtIn.permissionManagement.ui.title)
        .slider(data.builtIn.permissionManagement.ui.slider[0].name, data.builtIn.permissionManagement.ui.slider[0].min, data.builtIn.permissionManagement.ui.slider[0].max, data.builtIn.permissionManagement.ui.slider[0].valueStep, TargetUser.getLevel())
        .toggle(data.builtIn.permissionManagement.ui.toggle[0].name, TargetUser.getData("hide_permissions_view"))
        .submitButton(data.builtIn.permissionManagement.ui.submit);
    permissionManagementUi.show(player).then(r => {
        if (r.canceled) {
            builtInToolUiShow(player);
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
async function logUiShow(player) {
    let logs = SystemUser.getData("log").logs;
    let logUi = new ui.ActionFormData()
        .title(data.builtIn.log.ui.title)
        .body(data.builtIn.log.ui.body);
    logUi.button(data.builtIn.log.ui.button[0].name);
    for (let i of logs) {
        logUi.button(tool.translationf(data.builtIn.log.ui.button[1].name, i.Name));
    };
    logUi.show(player).then(r => {
        if (r.canceled) {
            builtInToolUiShow(player);
            return;
        };
        if (r.selection === 0) {
            addLogUiShow(player);
            return;
        };
        let targetLog = logs[r.selection - 1];
        let operationUi = new ui.ActionFormData()
            .title(data.builtIn.log.operationUi.title)
            .body(tool.translationf(data.builtIn.log.operationUi.body, targetLog.Name, targetLog.Message, targetLog.Recorder, targetLog.Date, targetLog.Uuid))
            .button(data.builtIn.log.operationUi.button[0].name, data.builtIn.log.operationUi.button[0].image);
        operationUi.show(player).then(r => {
            if (r.canceled) {
                logUiShow(player);
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

async function addLogUiShow(player) {
    let text = await multiIineTextEditingUiShow(player, ["Log", data.builtIn.log.add.tip]);
    try {
        text = text.split("\n", 2);
    } catch {
        tool.printErr(data.builtIn.log.add.error, "Error", data.logInfoSource, player);
        SystemUser.addLog(new Date().toString(), data.builtIn.log.add.error);
        return;
    };
    User.getUser(player).addLog(text[0], text[1]);
    tool.printErr(data.builtIn.log.add.info, "Info", data.infoSource, player);
    logUiShow(player);
};

async function commandSystemEventUseRequestUiShow(player, message) {
    if (!config.commandSystem.eventUse.UIRequest.use) return;
    let playerUser = User.getUser(player);
    let useTime = playerUser.getData("commandSystemEventUseTime");
    const currentTime = new Date().getTime();
    if ((currentTime - useTime) <= (config.commandSystem.eventUse.UIRequest.requestPostpone * 1000)) return;
    let result = await askUiShow(player, data.commandSystem.eventUse.ui.title, data.commandSystem.eventUse.ui.body);
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
    aboutUiShow,
    toolUiShow,
    OPToolUiShow,
    settingUiShow,
    commandSystemUiShow,
    UDUiShow,
    runcmd,
    SystemUser,
    commandSystemEventUseRequestUiShow
};
// 导出