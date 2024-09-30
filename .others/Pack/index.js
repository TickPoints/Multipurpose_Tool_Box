const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const targetDir = "../../";

function addDirectoryToZip(basePath, zip) {
    fs.readdirSync(targetDir).forEach(file => {
        const absPath = path.join(basePath, file);
        const stat = fs.lstatSync(absPath);
        if (!file.startsWith(".") && (stat.isFile() || stat.isDirectory())) {
            zip.addLocalFile(absPath);
        };
    });
};

function Main() {
    const zip = new AdmZip();
    addDirectoryToZip(targetDir, zip);
    zip.writeZip("./pack.zip");
    fs.copyFile("./pack.zip", "./pack.mcpack", (err) => {
        if (err) {
            console.error("复制文件时出错:", err);
        } else {
            console.warn("任务完成");
        };
    });
};

Main();