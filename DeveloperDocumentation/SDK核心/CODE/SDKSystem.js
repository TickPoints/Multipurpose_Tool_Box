import {
    printErr
}
from "./point.js";
/**
 * @typedef {("Info"|"Error"|"Warn"|"Debug")} LogLevel
 */

/**
 * @type {object}
 * @property {string} id - 插件的ID。
 * @property {string} name - 插件的名称。
 * @property {Object} version - 插件和SDK的版本数据。
 * @property {string} version.SDK - SDK版本。
 * @property {string} version.Plugin - 插件版本。
 */
const SDKSystem = {
    name: "Unknown",
    id: "Unknown",
    RequestTimeLimit: 10,
    version: {
        /** @readonly */
        "SDK": "0.0.7",
        "Plugin": "Unknown"
    },
    /**
     * 根据已有的名称的数据在聊天框输出标准化文本
     * @param {string} message - 欲输出的数据
     * @param {LogLevel} [type] - 输出类型
     */
    print: function(message, type = "Info") {
        printErr(message, type, SDKSystem.name);
    }
}

export {
    SDKSystem
}