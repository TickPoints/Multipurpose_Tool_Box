import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import * as tool from "../point.js";
import {
    debugMes
}
from "./debugMes.js";
import {
    commandData as data
}
from "./commandData.js";
import {
    runcmd
}
from "../Main.js";
import {
    User
}
from "../user.js";
import {
    config as SystemConfig
}
from "../config.js";


function configureParser(config, parameters, performer, tipSource) {
    if (config.needPermission === true) {
        let performerUser = User.getUser(performer);
        if ((performerUser !== null && !performerUser.reachLevel(config.RequiredPermission)) || (performerUser === null && SystemConfig.commandSystem.notUser.permission <= config.RequiredPermission)) {
            tool.printErr(tool.translationf(debugMes.input.needPermission, config.RequiredPermission), "Error", tipSource, performer);
            return -1;
        };
    };
    // Parameter Restriction Section 参数限制部分
    if (config.parameters === undefined) return -1;
    for (let i = 0; i < config.parameters.length; i++) {
        let requirement = config.parameters[i].requirement;
        if (parameters[i] === undefined) {
            if (requirement === "select") {
                continue;
            } else {
                tool.printErr(tool.translationf(debugMes.configureParser.parameters.deficiency, i), "Debug", tipSource, performer);
                return -1;
            };
        };
        switch (config.parameters[i].type) {
            case "string":
                break;
            case "number":
                if (isNaN(Number(parameters[i]))) {
                    tool.printErr((tool.translationf(debugMes.configureParser.parameters.type.input.error, parameters[i], parameters[i - 1], parameters[i + 1]) + debugMes.configureParser.parameters.type.input.number), "Debug", tipSource, performer);
                    return -1;
                };
                if (config.parameters[i].translation === true) {
                    parameters[i] = Number(parameters[i]);
                };
                break;
            case "int":
                if (parseInt(parameters[i]) !== Number(parameters[i])) {
                    tool.printErr((tool.translationf(debugMes.configureParser.parameters.type.input.error, parameters[i], parameters[i - 1], parameters[i + 1]) + debugMes.configureParser.parameters.type.input.int), "Debug", tipSource, performer);
                    return -1;
                };
                if (config.parameters[i].translation === true) {
                    parameters[i] = Number(parameters[i]);
                };
                break;
            case "enumeration":
                let enumeration = config.parameters[i].enumeration;
                if (!enumeration.includes(parameters[i])) {
                    tool.printErr((tool.translationf(debugMes.configureParser.parameters.type.input.error, parameters[i], parameters[i - 1], parameters[i + 1]) + tool.translationf(debugMes.configureParser.parameters.type.input.enumeration, enumeration)), "Debug", tipSource, performer);
                    return -1;
                };
                break;
            case "entity":
                try {
                    entity = mc.world.getEntity(parameters[i]);
                } catch {
                    tool.printErr((tool.translationf(debugMes.configureParser.parameters.type.input.error, parameters[i], parameters[i - 1], parameters[i + 1]) + debugMes.configureParser.parameters.type.input.player), "Debug", tipSource, performer);
                    return -1;
                };
                if (config.parameters[i].translation === true) {
                    parameters[i] = mc.world.getEntity(parameters[i]);
                };
                break;
            case "player":
                let entity;
                try {
                    entity = mc.world.getEntity(parameters[i]);
                } catch {
                    tool.printErr((tool.translationf(debugMes.configureParser.parameters.type.input.error, parameters[i], parameters[i - 1], parameters[i + 1]) + debugMes.configureParser.parameters.type.input.player), "Debug", tipSource, performer);
                    return -1;
                };
                if (entity.typeId !== "minecraft:player") {
                    tool.printErr((tool.translationf(debugMes.configureParser.parameters.type.input.error, parameters[i], parameters[i - 1], parameters[i + 1]) + debugMes.configureParser.parameters.type.input.player), "Debug", tipSource, performer);
                    return -1;
                };
                if (config.parameters[i].translation === true) {
                    parameters[i] = mc.world.getEntity(parameters[i]);
                };
                break;
            case "json":
                try {
                    JSON.parse(parameters[i]);
                } catch {
                    tool.printErr((tool.translationf(debugMes.configureParser.parameters.type.input.error, parameters[i], parameters[i - 1], parameters[i + 1]) + debugMes.configureParser.parameters.type.input.json), "Debug", tipSource, performer);
                    return -1;
                };
                if (config.parameters[i].translation === true) {
                    parameters[i] = JSON.parse(parameters[i]);
                };
                break;
            case "boolean":
                if (parameters[i] !== "true" && parameters[i] !== "false") {
                    tool.printErr((tool.translationf(debugMes.configureParser.parameters.type.input.error, parameters[i], parameters[i - 1], parameters[i + 1]) + debugMes.configureParser.parameters.type.input.boolean), "Debug", tipSource, performer);
                    return -1;
                };
                if (config.parameters[i].translation === true) {
                    if (parameters[i] === "true") parameters[i] = true;
                    if (parameters[i] === "false") parameters[i] = false;
                };
                break;
            case "adaptation":
                if (config.parameters[i].translation !== true) return;
                if (parameters[i] === "true" || parameters[i] === "false") {
                    if (parameters[i] === "true") parameters[i] = true;
                    if (parameters[i] === "false") parameters[i] = false;
                    return;
                };
                if (config.parameters[i].canBeEntity === true && mc.world.getEntity(parameters[i]) !== undefined) {
                    parameters[i] = mc.world.getEntity(parameters[i]);
                    return;
                };
                if (!isNaN(Number(parameters[i]))) {
                    parameters[i] = Number(parameters[i]);
                    return;
                };
                try {
                    parameters[i] = JSON.parse(parameters[i]);
                } catch {};
                break;
            case "commandName":
                if (!parameters[i] in Object.keys(interpreter)) {
                    tool.printErr((tool.translationf(debugMes.configureParser.parameters.type.input.error, parameters[i], parameters[i - 1], parameters[i + 1]) + debugMes.configureParser.parameters.type.input.commandName), "Debug", tipSource, performer);
                    return -1;
                };
                break;
            default:
                tool.printErr(tool.translationf(debugMes.configureParser.parameters.type.notFound, config.parameters[i].type), "Debug", tipSource, performer);
                return -1;
        };
    };
};

function run(command, performer = mc.world) {
    let entry = interpreter;
    entry = entry[command[0]];
    for (let i = 0; i < command.length; i++) {
        if (entry === undefined) {
            tool.printErr(tool.translationf(debugMes.input.data.commandId.notFound, command[i]), "Debug", data.tipSource, performer);
            return;
        };
        switch (entry.type) {
            case "function":
                let parameters = command.slice(i + 1);
                let fun = entry.run;
                let config = entry.config;
                if (config !== undefined) {
                    if (configureParser(config, parameters, performer, command[i]) === 1) return;
                };
                if (typeof fun != "function") {
                    if (typeof fun === "string") {
                        // 污染警告 Pollution Warning
                        eval(`fun = ${fun}`);
                    } else {
                        return;
                    };
                };
                parameters = [performer, ...parameters];
                try {
                    return fun(...parameters);
                } catch (e) {
                    tool.printErr(`${e}${e.stack}`, "Debug", data.tipSource, performer);
                };
                break;
            case "subcommand":
                entry = entry.subcommand[command[i + 1]];
                break;
            case "copy":
                let fromValue = entry.from;
                let copyBit = interpreter;
                for (let i of fromValue.split(".")) {
                    copyBit = copyBit[i];
                };
                if (copyBit === undefined) {
                    tool.printErr(debugMes.interpreter.copy.sourceObject.notFound, "Debug", data.tipSource, performer);
                    return;
                };
                command.splice(i, 0, command[i]);
                entry = copyBit;
                break;
            default:
                tool.printErr(tool.translationf(debugMes.interpreter.type.err, entry.type), "Debug", data.tipSource, performer);
                return;
        };
    };
};

let translationMap = {
    "\\n": "\n"
};

function translation(str) {
    let string = tool.deepClone(str);
    for (let i of Object.keys(translationMap)) {
        string = string.replace(i, translationMap[i]);
    };
    return string;
};

function parseCommand(performer, com, subcommand = []) {
    let command;

    function substitution(originalString, replacementString, startIndex, endIndex) {
        return `${originalString.substring(0, startIndex)}${replacementString}${originalString.substring(endIndex)}`;
    };

    if (com.includes("(")) {
        let stack = [];

        function isOuter() {
            for (let i of stack) {
                if (i.value === "&" || i.isOuter) return false;
            };
            return true;
        };

        const length = com.length;
        for (let charValue = 0; charValue < length; charValue++) {
            let char = com[charValue];
            if (char === "(") {
                if (com[charValue + 1] === "&") {
                    stack.push({
                        "key": charValue,
                        "value": "&",
                        "isOuter": isOuter()
                    });
                } else {
                    stack.push({
                        "key": charValue,
                        "value": "("
                    });
                };
            } else if (char === ")") {
                let pop = stack.pop();
                if (!isOuter()) continue;
                let newCommand;
                if (pop.value === "&") {
                    newCommand = substitution(com, `command.${subcommand.length}`, pop.key, charValue + 1);
                    subcommand.push(com.substring(pop.key + 2, charValue));
                    return parseCommand(performer, newCommand, subcommand);
                } else if (pop.value === "(") {
                    newCommand = substitution(com, parseCommand(performer, com.substring(pop.key + 1, charValue)), pop.key, charValue + 1);
                    return parseCommand(performer, newCommand, subcommand);
                };
            };
        };
    } else {
        command = com.split(" -");
    };
    for (let i = 0; i < command.length; i++) {
        if (command[i].substring(0, 8) === "command.") {
            command[i] = subcommand[+command[i].substring(8)];
        };
        command[i] = translation(command[i]);
    };
    return run(command, performer);
};

let interpreter;

function reload() {
    interpreter = {
        "console": {
            "type": "function",
            "run": function(performer, type, mes) {
                console[type](mes);
                return mes;
            },
            "config": {
                "parameters": [{
                    "type": "enumeration",
                    "enumeration": ["warn", "error"]
                }, {
                    "type": "string"
                }],
                "RequiredPermission": 5,
                "needPermission": true
            }
        },
        "getEntity": {
            "type": "function",
            "run": function(performer, type, dimension = null, options = null) {
                let returnValue;
                if (dimension === null) dimension = performer.dimension.id;
                switch (type) {
                    case "self":
                        returnValue = performer;
                        break;
                    case "target":
                        returnValue = mc.world.getDimension(dimension)
                            .getEntities(JSON.parse(options))[0];
                        break;
                    case "player":
                        options = {
                            "type": "minecraft:player"
                        };
                        returnValue = mc.world.getDimension(dimension)
                            .getEntities(options);
                        let location = performer.location;
                        let players = [];
                        for (let i of returnValue) {
                            let sum = 0;
                            sum += Math.abs(i.location.x - location.x);
                            sum += Math.abs(i.location.y - location.y);
                            sum += Math.abs(i.location.z - location.z);
                            players.push(sum);
                        };
                        const minIndex = players.indexOf(Math.min(...players));
                        returnValue = returnValue[minIndex];
                        break;
                    default:
                        return null;
                };
                return returnValue.id;
            },
            "config": {
                "parameters": [{
                    "type": "enumeration",
                    "enumeration": ["self", "target", "player"]
                }, {
                    "type": "enumeration",
                    "enumeration": ["overworld", "nether", "the_end"],
                    "requirement": "select"
                }, {
                    "type": "json",
                    "requirement": "select"
                }],
                "RequiredPermission": 3,
                "needPermission": true
            }
        },
        "Macro": {
            "type": "function",
            "run": async function(performer, id) {
                import("./Macros/index.js").then(Macro => {
                    let Macros = Macro.MacroList;
                    if (typeof Macros[id] !== "string") {
                        tool.printErr(tool.transactionf(debugMes.Macro.idNotFound, id), "Error", data.tipSource, performer);
                        return false;
                    };
                    import(`./Macros/${Macros[id]}`).then(Data => {
                        for (let i of Data.MacroData) {
                            let com = i.replace(/\t/g, "");
                            com = com.replace(/(\s{4,})/g, " ");
                            com = com.replace(/\( /g, "(");
                            com = com.replace(/ \)/g, ")");
                            try {
                                runcmd(performer, com);
                            } catch {};
                        };
                        return true;
                    }).catch(e => {
                        tool.printErr(tool.translationf(debugMes.Macro.fileNotFound, Macros[id]), "Error", data.tipSource, performer);
                        console.error(e, e.stack)
                        return false;
                    });
                }).catch(() => {
                    tool.printErr(debugMes.Macro.indexNotFound, "Error", data.tipSource, performer);
                    return false;
                });
            },
            "config": {
                "parameters": [{
                    "type": "string"
                }],
                "RequiredPermission": 5,
                "needPermission": true
            }
        },
        "menu": {
            "type": "function",
            "run": function(performer) {
                tool.giveItemStack(performer, new mc.ItemStack("tool:menu"));
            }
        }
    };
};

// 初始化
reload();

export {
    run,
    interpreter,
    reload,
    parseCommand,
    translationMap
};