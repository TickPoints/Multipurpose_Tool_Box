import "./parseMessage.js";
class DataReceive {
    constructor(id, uuid) {
        if (DataReceive.space[id] === undefined) DataReceive.space[id] = {};
        DataReceive.space[id][uuid] = this;
    };
    status = false;
    data;
    getStatus() {
        if (this.status) {
            this.status = false;
            return {
                status: true,
                data: this.data
            };
        } else {
            return {
                status: false
            };
        }
    };
    static space = {};
    static trigger(id, data) {
        let dataSpace = DataReceive.space[id.split(":")[1]];
        if (dataSpace === undefined) return;
        dataSpace = dataSpace[id.split(":")[0]];
        if (dataSpace === undefined) return;
        dataSpace.status = true;
        dataSpace.data = data;
    };
}

export {
    DataReceive
}