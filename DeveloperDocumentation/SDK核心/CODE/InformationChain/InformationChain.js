import * as tool from "../point.js";
import {
    DataReceive
}
from "./receiveData";

import {
    sendDataPack
}
from "./sendDataPack.js";

class InformationChain {
    id = "";
    uuid;
    callback = [];
    otherData = {};
    constructor(id = "", uuid = tool.generateUUID()) {
        this.id = id;
        this.uuid = uuid;
    };
    setReceive(id) {
        this.callback.push(id);
    };
    setOtherData(data) {
        this.otherData = data;
    };
    load(pack, meta = {}) {
        meta.uuid = this.uuid;
        sendDataPack(this.id, pack, meta, this.otherData);
        let DataReceives = {};
        for (let i of this.callback) {
            let data = new DataReceive(i, this.uuid);
            DataReceives[i] = data;
        };
        return DataReceives;
    };
}

export {
    InformationChain
}