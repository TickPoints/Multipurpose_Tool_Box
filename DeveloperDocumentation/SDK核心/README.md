# 结构
核心不是`SDK`本体，它没有`SDK`提供的接口调用和稳定格式输出(即`User`解释对象等生成)。它是用来进行全局广播监听和数据互通的。主要代码在`InformationChain`和`broadcastResponse`文件夹中。
# 示例使用
```js
// 导入工具
import * as mc from "@minecraft/server";
import * as toolapi from "./TOOLSDK/index.js";

// 判断对象是否为错误
function isError(obj) {
    if (obj == null || typeof obj !== "object") return false;
    const constructor = obj.constructor;
    if (typeof constructor !== "function") return false;
    return constructor === Error || constructor.prototype instanceof Error;
};

// 这里以用户代理操作为例
function ProxyExecution(OperationName, ...OperationParameters) {
    // 设置调用口
    let thisInterface = new toolapi.InformationChain("toolAPI:System.UserSystem.ProxyAction");
    // 设置数据接收
    thisInterface.setReceive("result");
    thisInterface.setReceive("return");
    thisInterface.setReceive("error");
    // 发送包并开始接收数据
    thisInterface = thisInterface.load(
    // 主数据包数据
    {
        "OperationName": OperationName,
        "OperationParameters": OperationParameters,
        "User": { // User对象解析
            "General": {
                "method": "bind",
                "playerName": mc.world.getAllPlayers()[0].name
            },
            "type": "General"
        }
    },
    // meta数据
    {
        "name": toolapi.SDKSystem.name,
        "id": toolapi.SDKSystem.id,
        "version": toolapi.SDKSystem.version
    });
    // 计算超时
    let time = 0;
    return new Promise(async (resolve) => {
        while (true) {
            let receiver = thisInterface.result.getStatus();
            // 获取主状态(这是所有接口都有的result返回，如果一切都运行正常，就会在运行完成后返回Pass，所以监听这个状态，如果成功得到了数据，说明一切都完成了运行)
            if (receiver.status === true) {
                // 判断是否获取到数据
                if (receiver.data.packData.type === "Pass") {
                    // 如果为Pass说明功能正常运行，查看是否有报错或者是返回值
                    let returnValue = thisInterface.return.getStatus();
                    if (returnValue.status) {
                        // 查看返回数据是否存在
                        resolve(returnValue.data.packData.returnValue);
                        return;
                    };
                    let error = thisInterface.return.getStatus();
                    if (error.status) {
                        // 查看错误是否存在
                        resolve(new toolapi.Errors.InterfaceCallError(error.data.packData.error));
                        return;
                    };
                    resolve();
                } else {
                    // 根据文档中提供的内容，说明出现Error，返回Error
                    resolve(new toolapi.Errors.InterfaceCallError(receiver.data.packData.message));
                };
                // 结束操作
                return;
            };
            if (time > toolapi.SDKSystem.RequestTimeLimit) {
                // 超出限定时间返回错误
                resolve(new toolapi.Errors.RequestTimeoutError());
                return;
            };
            await mc.system.waitTicks(1);
            time++;
        };
    });
};

toolapi.broadcastResponse.load.listen(async () => {
    // 修改插件元数据名
    toolapi.SDKSystem.name = "SDK核心测试";
    // 修改插件元数据ID
    toolapi.SDKSystem.id = "TickPoints.Easy";
    // 设置插件版本
    toolapi.SDKSystem.version.Plugin = "0.0.1";
    // 调用定义的方法
    ProxyExecution(
        "addLog",   // 调用的代理用户方法
        // 给调用的代理用户方法传递参数
        "测试",
        "使用代理用户添加Log"
    ).then(r => {
        if (isError(r)) {   // 如果是Error，打印
            console.error(r);
        } else {
            console.warn(`result: ${r}`);   // 获取返回值
        };
    }).catch(e => {
        console.error(e, e.stack);
    });
});
```