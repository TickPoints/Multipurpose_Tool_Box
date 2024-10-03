import * as mc from "@minecraft/server";
import * as tool from "./point.js";

import {
    config
}
from "./config.js";
import {
    runcmd
}
from "./Main.js";

function getDateString() {
    let currentTime = new Date();
    let message = config.user.date;
    let text = [currentTime.getMilliseconds(),
        currentTime.getSeconds(),
        currentTime.getMinutes(),
        currentTime.getHours(),
        currentTime.getDay(),
        currentTime.getDate(),
        currentTime.getMonth(),
        currentTime.getFullYear(),
        currentTime.getTime()
    ];
    for (let i = 1; i < text.length + 1; i++) {
        if (message.includes(`%%${i}`)) {
            message = message.replace(new RegExp(`%%${i}`, "g"), text[i - 1]);
        };
    };
    return message;
};

class User {
    #name;
    #level;
    #data = {};
    #binding;
    #canBind = false;
    constructor(name, level) {
        this.#name = name;
        this.#level = level;
        User.nameList[name] = this;
    };
    getLevel() {
        return this.#level;
    };
    setLevel(level) {
        this.#level = level;
        if (this.#canBind) this.bind(this.#binding);
    };
    getRootData() {
        return this.#data;
    };
    // 仅多用工具包内部使用，不推荐插件使用
    setRootData(data) {
        this.#data = data;
        if (this.#canBind) this.bind(this.#binding);
    };
    bind(target) {
        let message = {
            "name": this.#name,
            "level": this.#level,
            "data": this.#data
        };
        tool.saveData("UserData", message, target);
        this.#binding = target;
        this.#canBind = true;
    };
    setData(name, message) {
        this.#data[name] = message;
        if (this.#canBind) this.bind(this.#binding);
    };
    getData(name) {
        return this.#data[name];
    };
    getBinding() {
        return this.#binding;
    };
    getName() {
        return this.#name;
    };
    setName(name) {
        this.#name = name;
        if (this.#canBind) this.bind(this.#binding);
    };
    reachLevel(level) {
        if (this.#level >= level) {
            return true;
        } else {
            return false;
        };
    };
    // 特殊操作
    raise(user, level) {
        if (this.reachLevel(user.getLevel()) && this.reachLevel(level)) {
            user.setLevel(level);
            return 1;
        } else {
            return -1;
        };
    };
    sendMail(user, mail) {
        let Mail = {
            "SourceName": this.#name,
            "TargetName": user.getName(),
            "Message": mail,
            "Date": getDateString(),
            "Uuid": tool.generateUUID()
        };
        let box = this.getData("mailbox");
        box.box.send.push(Mail);
        this.setData("mailbox", box);
        //
        box = user.getData("mailbox");
        box.box.receive.push(Mail);
        user.setData("mailbox", box);
    };
    addLog(name, log) {
        let SystemUser = User.getUser("SystemUser", "name");
        let logData = {
            "Name": name,
            "Message": log,
            "Recorder": this.#name,
            "Date": getDateString(),
            "Uuid": tool.generateUUID()
        };
        let logs = SystemUser.getData("log");
        logs.logs.push(logData);
        SystemUser.setData("log", logs);
    };
    runCmd(command) {
        if (this.#canBind) {
            runcmd(this.#binding, command);
        } else {
            runcmd(mc.world, command);
        };
    };
    static getUser(target, type = "bind") {
        switch (type) {
            case "bind":
                let data = tool.getData("UserData", target);
                if (data === null) {
                    return null;
                };
                let user = new User(data.name, data.level);
                for (var i of Object.keys(data.data)) {
                    user.setData(i, data.data[i]);
                };
                user.bind(target);
                return user;
            case "name":
                return User.nameList[target];
            default:
                return null;
        };
    };
    static nameList = {};
    static PluginUser = class {
        static loadingUserMap = {};
        static getUser(packId, id) {
            let pack = User.PluginUser.loadingUserMap[packId];
            if (pack === undefined) return null;
            pack = pack[id];
            if (pack === undefined) return null;
            return pack;
        };
        constructor(packId, id) {
            this.id = id;
            this.data = {
                "name": `${packId}:${id}`,
                "mailbox": {
                    "box": {
                        "send": [],
                        "receive": []
                    }
                }
            };
            let pack = User.PluginUser.loadingUserMap[packId];
            if (pack === undefined) User.PluginUser.loadingUserMap[packId] = {};
            pack = User.PluginUser.loadingUserMap[packId];
            pack[id] = this;
        };
        sendMail(user, mail, uuid = tool.generateUUID()) {
            let Mail = {
                "SourceName": this.getName(),
                "TargetName": user.getName(),
                "Message": mail,
                "Date": getDateString(),
                "Uuid": uuid
            };
            let box = this.data.mailbox.box;
            box.send.push(Mail);
            // 
            box = user.getData("mailbox");
            box.box.receive.push(Mail);
            user.setData("mailbox", box);
        };
        addLog(name, log) {
            let SystemUser = User.getUser("SystemUser", "name");
            let logData = {
                "Name": name,
                "Message": log,
                "Recorder": this.getName(),
                "Date": getDateString(),
                "Uuid": tool.generateUUID()
            };
            let logs = SystemUser.getData("log");
            logs.logs.push(logData);
            SystemUser.setData("log", logs);
        };
        getData() {
            return this.data;
        };
        getName() {
            return this.data.name ? this.data.name : this.id;
        };
        data;
        id = "";
    };
};

function deepMerge(target, source) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (!target.hasOwnProperty(key) || target[key] === undefined) {
                target[key] = source[key];
            } else {
                if (typeof target[key] === "object" && target[key] !== null && typeof source[key] === "object" && source[key] !== null) {
                    deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                };
            };
        };
    };
    return target;
};

function updateSystemUser(SystemUser) {
    SystemUser = new User("SystemUser", 6);
    SystemUser.bind(mc.world);
    const SystemUserDataSource = {
        "mailbox": {
            "box": {
                "receive": [],
                "send": []
            }
        },
        "has_hop": false,
        "log": {
            "logs": []
        }
    };
    SystemUser.setRootData(deepMerge(SystemUser.getRootData(), SystemUserDataSource));
};

function updatePlayerUser(player) {
    let playerUser = new User(`Player-${player.name}`, 1);
    playerUser.bind(player);
    const PlayerUserDataSource = {
        "mailbox": {
            "box": {
                "receive": [],
                "send": []
            }
        },
        "hide_permissions_view": false,
        "viewed_update_tip": {
            "tip": []
        }
    };
    playerUser.setRootData(deepMerge(playerUser.getRootData(), PlayerUserDataSource));
};

export {
    User,
    updatePlayerUser,
    updateSystemUser
};