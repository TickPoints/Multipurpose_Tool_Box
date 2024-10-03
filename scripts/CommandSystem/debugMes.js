export const debugMes = {
    "interpreter": {
        "type": {
            "err": "错误(或丢失)的 %%s 类型" // Wrong (or missing) %%s type
        },
        "copy": {
            "sourceObject": {
                "notFound": "Copy 来源对象未找到"  // Copy source object not found
            }
        }
    },
    "input": {
        "data": {
            "commandId": {
                "notFound": "未找到的命令 %%s" // Command %%s is not found
            }
        },
        "needPermission": "你没有所需的 %%s 级权限"   // %%s lv permissions you need
    },
    "configureParser": {
        "parameters": {
            "type": {
                "notFound": "不合法的类型: %%s", // Illegal type
                "input": {
                    "error": "意外的 %%1 出现在 %%2 >>> %%1 <<< %%3 之间。", // Unexpected %%1 between %%2 >> %% 1 << %%3.
                    "number": "这应当为 Number 类型。", // This should be of type Number.
                    "int": "这应当为 Int 类型。", // This should be of type Int.
                    "enumeration": "这应当为 Enumeration 类型，且只能为 %%s 中的一个。", // This should be of type Enumeration and only one of [%%s].
                    "entity": "这应当为 Entity 类型。", // This should be of type Entity.
                    "player": "这应当为 Player 类型。", // This should be of type Player.
                    "json": "这应当为 JSON 类型。", // This should be a JSON type.
                    "boolean": "这应当为 Boolean 类型。",  // This should be of type Boolean.
                    "commandName": "这应当为 commandName 类型。"   // This should be of type commandName.
                }
            },
            "deficiency": "parameters[%%s] 缺失。" // [Parameters %%s] is missing.
        }
    },
    "Macro": {
        "indexNotFound": "index.js 文件丢失。",    // The index.js file is missing
        "fileNotFound": "%%s 文件未找到，请检查是否写入index.js，是否export和是否拼写正确。",    // The %%s file was not found. Please verify that the index.js, is written and that export and are spelled correctly.
        "idNotFound": "%%s 的路径对照不在 index.js 中，请检查是否写入index.js且类型是否为 String。"    // Path cross-reference for %%s is not in index.js, check that index.js is written and type is String
    },
    "gettingMenuPrompt": "已成功获得menu物品。" // Successfully acquired the menu item.
};
