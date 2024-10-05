import * as tool from "../point.js";
import {
    world
}
from "@minecraft/server";

function sendDataPack(id, data, meta, otherData = {}) {
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
            "uuid": meta.uuid,
            "id": meta.id,
            "name": meta.name
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
    world.getDimension("overworld").runCommand(`scriptevent ${id} ${message}`);
};

export {
    sendDataPack
}