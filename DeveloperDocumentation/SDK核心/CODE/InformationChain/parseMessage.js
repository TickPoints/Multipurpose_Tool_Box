import {
    DataReceive
}
from "./receiveData.js";
import {
    system
}
from "@minecraft/server";

system.afterEvents.scriptEventReceive.subscribe(event => {
    if (event.sourceType !== "World")
        parseMessage(event.id, event.message);
});

let _messagePackSpace = {};

function parseMessage(id, message) {
    let messagePack;
    try {
        messagePack = JSON.parse(message);
    } catch {
        return;
    };
    let dataPack;
    if (messagePack.type === null) return;
    if (messagePack.data === null) return;
    if (messagePack.type === "all") {
        dataPack = messagePack.data;
    } else {
        if (messagePack.space === null) return;
        switch (messagePack.type) {
            case "start":
                _messagePackSpace[messagePack.space] = [];
                _messagePackSpace[messagePack.space].push(messagePack.data);
                break;
            case "transmission":
                try {
                    _messagePackSpace[messagePack.space].push(messagePack.data);
                } catch {
                    return;
                };
                break;
            case "end":
                try {
                    _messagePackSpace[messagePack.space].push(messagePack.data);
                } catch {
                    return;
                };
                dataPack = "";
                for (let i of _messagePackSpace[messagePack.space]) {
                    dataPack += i;
                };
                _messagePackSpace[messagePack.space] = undefined;
                break;
            default:
                return;
        };
    };
    if (dataPack == null) return;
    try {
        dataPack = JSON.parse(dataPack);
    } catch {
        return;
    };
    if (dataPack.meta == null) return;
    if (dataPack.meta.id == null) return;
    if (dataPack.packData == null) return;
    DataReceive.trigger(id, dataPack);
};