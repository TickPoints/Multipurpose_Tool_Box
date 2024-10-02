// Node.js
const fs = require("fs");
const vm = require("vm");
const readline = require("readline");

function rankJSON(jsonObj) {
    const sortedMap = new Map(Object.entries(jsonObj).sort(([key1], [key2]) => key1.localeCompare(key2)));
    return Object.fromEntries(sortedMap);
};

function generateInterfacesDocumentData(name, data) {
    let tip = "";
    if (data.discard !== undefined) {
        tip += "Tip: 已弃用\n";
        if (data.discard.toUse !== undefined) tip += `尝试改用\`${data.discard.toUse}\`\n`;
    };
    if (data.experiment) tip += "_Tip: 实验中，在未来的版本中可能删除或做过多修改_\n";
    if (name.split(".")[0] === "System") tip += "_Tip: 需要系统级权限_\n";
    let parameter = "# 参数\n";
    parameter += `\`\`\`\n${JSON.stringify(rankJSON(data.needData), null, 4)}\n\`\`\`\n`;
    for (let i of Object.keys(rankJSON(data.description.needData))) {
        parameter += `## ${i}\n${data.description.needData[i]}\n`;
    };
    let functionTip = "# 功能\n";
    functionTip += data.description.function;
    let returnPackTip = "# 返回包\n下面给出包不一定都存在，视情况有所变动\n\n";
    for (let i of Object.keys(rankJSON(data.returnPack))) {
        returnPackTip += `## ${i}\nId: ${i}\n\n\`\`\`\n\n`;
        for (let j of data.returnPack[i]) {
            returnPackTip += `${JSON.stringify(rankJSON(j), null, 4)}\n\n`;
        };
        returnPackTip += `\`\`\`\n`;
    };
    return `${tip}${parameter}${functionTip}\n${returnPackTip}`;
};

function generateEventListDocumentData(eventList) {
    const beginning = "# 引言\n在`0.1.6`版本之后，多用工具包更新了事件引擎，用来统管所有事件，这里将多用工具包内部的所有事件(包括无法直接使用`event`接口调用的)展示。\n# 事件列表\n";
    let tip = "";
    for (let i of Object.keys(eventList)) {
        tip += `## ${i}\n`
        tip += `### 描述\n${eventList[i].description.function}\n`;
        tip += "### 事件数据\n"
        const index = i;
        for (let i of Object.keys(rankJSON(eventList[index].description.data))) {
            tip += `#### ${i}\n${eventList[index].description.data[i]}\n`
        };
    };
    return `${beginning}${tip}`;
};

async function Main() {
    const RepoPath = "../../";
    let interfaceDocumentsPath = `${RepoPath}/DeveloperDocumentation/API/`;
    let eventListPath = `${RepoPath}/DeveloperDocumentation/特有概念/事件列表.md`
    
    const interfaceData = require("./DocumentationData.js").interfaceData;

    if (interfaceData) {
        for (let i of Object.keys(interfaceData)) {
            let documentData = generateInterfacesDocumentData(i, interfaceData[i]);
            await fs.promises.writeFile(`${interfaceDocumentsPath}${i}.md`, documentData, "utf8")
                .catch(err => console.error(err));
        };
    } else {
        console.error("无法正确读取InterfaceData");
    };
    
    const eventList = rankJSON(require("./DocumentationData.js").eventList);
    if (eventList) {
        let documentData = generateEventListDocumentData(eventList);
        await fs.promises.writeFile(eventListPath, documentData, "utf8")
            .catch(err => console.error(err));
    } else {
        console.error("无法正确读取eventList");
    };
    console.warn("任务结束!");
};

Main();