# 引言 
API由`interface.js`文件管理，提供了一系列可以操作 多用工具包 系统的方法，为了实现接口，API使用了一种特殊的方法完成数据互通(见[协议基本](##协议基本))。

这种方法即是通过 `scriptevent` 命令。

像下面这个例子:
```
scriptevent toolAPI:test {"meta":{"id":"test","uuid":"",version:""},"packData":{"RequestCode":1},"otherData":{}}
```
很容易就能看出后面的内容是`JSON.stringify()`后的JSON数据。通过这些东西，我们就可以完成数据包互通。
## 实现

由于命令有长度限制，所以当较长的数据需要传输时会出现问题，因此我们用到了下面的两个方法(他们同样在多用工具包内部使用了):

### 发送包
```js
function sendDataPack(id, data, uuid, otherData = {}) {
    function splitStringByLength(longStr) { // 将长数据分割成多个字段
        const chunkSize = 1000; // 每个分段的长度
        let startIndex = 0;
        let result = [];
        while (startIndex < longStr.length) {
            result.push(longStr.substring(startIndex, startIndex + chunkSize));
            startIndex += chunkSize;
        };
        return result;
    };
    // 基础数据包定义
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
    let packString = JSON.stringify(pack);
    if (packString.length > 1000) { // 分割字符串
    // 对长度大于100的分割字符串
        const packStringList = splitStringByLength(packString);
        const spaceUUID = tool.generateUUID();
        for (let i = 0; i < packStringList.length; i++) {
            let dataPack = {
                "type": "transmission",
                "space": spaceUUID,
                "data": packStringList[i]
            };
            if (i === 0) dataPack.type = "start";   // 对首个字段设置为开始
            if (i === packStringList.length - 1) dataPack.type = "end"; // 对，最后一个字段设置为结束
            _send(id, JSON.stringify(dataPack));    // 发送包
        };
    } else {
        let dataPack = {
            "type": "all",  // 将全部内容设置为ALL
            "data": packString
        };
        _send(id, JSON.stringify(dataPack));
    };
};

function _send(id, message) {
    mc.world.getDimension("overworld").runCommand(`scriptevent ${id} ${message}`);
};
```
### 获取包
```js
mc.system.afterEvents.scriptEventReceive.subscribe(event => {
    if (event.sourceType !== "World")   // 仅对 World 类型调用使用(防止玩家意外的调用出现错误)
        parseMessage(event.id, event.message);  // 解析数据
});

// 设置长数据包的储存空间
let _messagePackSpace = {};

function parseMessage(id, message) {
    let messagePack;
    try {
        messagePack = JSON.parse(message);  // 如果解析出错，那么报错
    } catch {
        tool.printErr(debugMes.interface.parseMessage.JSONParseError, "Debug", data.infoSource);
        return;
    };
    let dataPack;
    if (messagePack.type === null) {    // 如果类型不存在那么报错
        tool.printErr(debugMes.interface.parseMessage.messagePackError.typeError, "Debug", data.infoSource);
        return;
    };
    if (messagePack.data === null) {    // 如果主数据不存在那么报错
        tool.printErr(debugMes.interface.parseMessage.messagePackError.dataError, "Debug", data.infoSource);
        return;
    };
    if (messagePack.type === "all") {
        dataPack = messagePack.data;    // 当类型为all时，直接设置数据包
    } else {
        if (messagePack.space === null) {
            tool.printErr(debugMes.interface.parseMessage.messagePackError.spaceIdError, "Debug", data.infoSource);
            return;
        };
        // 类型不为all，分次保存
        switch (messagePack.type) {
            case "start":
                // 初始化数据空间
                _messagePackSpace[messagePack.space] = [];
                _messagePackSpace[messagePack.space].push(messagePack.data);
                break;
            case "transmission":
                // 将新数据放到已有的数据空间
                try {
                    _messagePackSpace[messagePack.space].push(messagePack.data);
                } catch {
                    tool.printErr(debugMes.interface.parseMessage.spaceError.spaceUninitialized, "Debug", data.infoSource);
                    return;
                };
                break;
            case "end":
                // 将新数据放到已有的数据空间
                try {
                    _messagePackSpace[messagePack.space].push(messagePack.data);
                } catch {
                    tool.printErr(debugMes.interface.parseMessage.spaceError.spaceUninitialized, "Debug", data.infoSource);
                    return;
                };
                // 整合数据空间数据
                dataPack = "";
                for (let i of _messagePackSpace[messagePack.space]) {
                    dataPack += i;
                };
                // 清除数据空间
                _messagePackSpace[messagePack.space] = undefined;
                break;
            default:
                tool.printErr(debugMes.interface.parseMessage.messagePackError.typeError, "Debug", data.infoSource);
                return;
        };
    };
    // 如果数据包不存在，说明现在还在传输中，直接返回
    if (dataPack == null) return;
    try {
        dataPack = JSON.parse(dataPack);
    } catch {
        tool.printErr(debugMes.interface.parseMessage.dataPackError.JSONParseError, "Debug", data.infoSource);
        return;
    };
    // 检查数据包
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
    // 对数据包做操作
    // ...
};
// 报错信息
const debugMes = {
    interface: {
        parseMessage: {
            messagePackError: {
                typeError: "MessagePack的解释错误: MessagePack 类型不存在",
                dataError: "MessagePack的解释错误: DataPack 不存在",
                spaceIdError: "MessagePack的解释错误: Space 不存在"
            },
            JSONParseError: "MessagePack的解释错误: JSON解释失败",
            spaceError: {
                spaceUninitialized: "MessageSpace的处理错误: Space 没有初始化"
            },
            dataPackError: {
                JSONParseError: "DataPack的解释错误: JSON解释失败",
                metaError: {
                    Uninitialized: "DataPack.meta的解释错误: meta数据不存在",
                    idUninitialized: "DataPack.meta的解释错误: Id不存在"
                },
                dataUninitialized: "DataPack.data的解释错误: 主数据不存在"
            }
        },
        load: {
            objectLost: "Id 为 %%1 的插件: 接口的调用错误: 需要使用的对象 %%2 不存在",
            objectTypeError: "Id 为 %%1 的插件: 接口的调用错误: 需要使用的对象 %%2 类型错误，应该为 %%3",
            notFound: "Id 为 %%1 的插件: 接口的调用错误: 其调用的接口 %%2 不存在"
        }
    }
};
```
_Tip:上面内容使用了 point.js，但省略了导入过程_
## 协议基本
在多用工具包中使用数据互通时必须遵守以下规则:

1. 数据包应该包括`meta`(元数据)，`packData`(传递的主要数据)，`otherData`(其他数据)

2. meta应包括以下内容:
```js
{
    "uuid": "",  // Uuid(我们不通过uuid来区分每个包，uuid应该是包自己需要使用的内容)，当进行操作有返回数据时，将通过`${meta.id}:${entry}`来作为 scriptevent 的命令，如需要接收返回数据，应该订阅这个命名空间
    "id": "",   // 这个是用来区分每个包的，如进行的操作需要用到高级的系统权限时，都会使用到这一部分来区分您的包
    "version": {}  // 这不是必须的，多用工具包使用了这些，以方便确定当前版本
}
```
4. packData用于传递主要数据如返回的内容等
5. otherData用于传递其他数据，非必要不使用

## 阅读接口文档
当调用接口时需要传递一些参数，这些参数在文档中以 "参数" 展示，如下:
```JSON
{
    "RequestCode": "number"
}
```


其中，键名对应着需要的参数名，键值对应着参数的类型(参数的类型是 typeof 返回的)，所以上面的参数需要传递像下面的这个包:

```JSON
{
    "RequestCode": 0
}
```
接下来还有 "功能"，它具体介绍了这个接口拥有什么功能，每个参数具体在干些什么。

最后则是返回包，如果没有返回包，返回包的部分则为Void，有的话则类似于下面这个:


```JSON
{
    "ReturnCode": "number"
}
```


其内容与上面的参数一致。
