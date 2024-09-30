let interfaceData = {
    "test": {
        "needData": {
            "RequestCode": "number"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }],
            "testResult": [{
                "result": "The test passed."
            }]
        },
        "description": {
            "needData": {
                "RequestCode": `请求码，只能为0或1，为0时，会在控制台打印"The test passed."，为1时则会返回包{"result":"The test passed."}`
            },
            "function": "一个测试，用于帮助插件确定多用工具包是否正常运行(或者是当前的基础协议是否正常)，如不正常则不会有效"
        }
    },
    "button.GeneralTool.add": {
        "needData": {
            "buttonName": "string",
            "buttonImage": "string",
            "callbackId": "string"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }]
        },
        "description": {
            "needData": {
                "buttonName": "需添加按钮的名称",
                "buttonImage": "需添加按钮的名称",
                "callbackId": "按钮点击时触发事件的Id"
            },
            "function": "在一般工具中注册一个按钮"
        }
    },
    "button.OPTool.add": {
        "needData": {
            "buttonName": "string",
            "buttonImage": "string",
            "callbackId": "string"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }]
        },
        "description": {
            "needData": {
                "buttonName": "需添加按钮的名称",
                "buttonImage": "需添加按钮的名称",
                "callbackId": "按钮点击时触发事件的Id"
            },
            "function": "在OP工具中注册一个按钮"
        }
    },
    "button.Setting.add": {
        "needData": {
            "buttonName": "string",
            "buttonImage": "string",
            "callbackId": "string"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }]
        },
        "description": {
            "needData": {
                "buttonName": "需添加按钮的名称",
                "buttonImage": "需添加按钮的名称",
                "callbackId": "按钮点击时触发事件的Id"
            },
            "function": "在设置中注册一个按钮"
        }
    },
    "event.UDUiShowed.listen": {
        "needData": {
            "callbackId": "string"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }],
            "callback": [{
                "sourceName": "打开UI的玩家名称"
            }]
        },
        "description": {
            "needData": {
                "callbackId": "提示包所需要的回调ID，事件触发后，提示包将发给此`callbackId:callback`"
            },
            "function": "监听 UDUiShowed 事件(即开发者文档UI打开事件)，事件触发后，会发送提示包"
        }
    },
    "event.SettingUiShowed.listen": {
        "needData": {
            "callbackId": "string"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }],
            "callback": [{
                "sourceName": "打开UI的玩家名称"
            }]
        },
        "description": {
            "needData": {
                "callbackId": "提示包所需要的回调ID，事件触发后，提示包将发给此`callbackId:callback`"
            },
            "function": "监听 SettingUiShowed 事件(即设置UI打开事件)，事件触发后，会发送提示包"
        }
    },
    "event.OPToolUiShowed.listen": {
        "needData": {
            "callbackId": "string"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }],
            "callback": [{
                "sourceName": "打开UI的玩家名称"
            }]
        },
        "description": {
            "needData": {
                "callbackId": "提示包所需要的回调ID，事件触发后，提示包将发给此`callbackId:callback`"
            },
            "function": "监听 OPUiShowed 事件(即OP工具UI打开事件)，事件触发后，会发送提示包"
        }
    },
    "event.ToolUiShowed.listen": {
        "needData": {
            "callbackId": "string"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }],
            "callback": [{
                "sourceName": "打开UI的玩家名称"
            }]
        },
        "description": {
            "needData": {
                "callbackId": "提示包所需要的回调ID，事件触发后，提示包将发给此`callbackId:callback`"
            },
            "function": "监听 ToolUiShowed 事件(即一般工具UI打开事件)，事件触发后，会发送提示包"
        }
    },
    "event.aboutUiShowed.listen": {
        "needData": {
            "callbackId": "string"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }],
            "callback": [{
                "sourceName": "打开UI的玩家名称"
            }]
        },
        "description": {
            "needData": {
                "callbackId": "提示包所需要的回调ID，事件触发后，提示包将发给此`callbackId:callback`"
            },
            "function": "监听 aboutUiShowed 事件(即\"关于\"UI打开事件)，事件触发后，会发送提示包"
        }
    },
    "event.menuUiShowed.listen": {
        "needData": {
            "callbackId": "string"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }],
            "callback": [{
                "sourceName": "打开UI的玩家名称"
            }]
        },
        "description": {
            "needData": {
                "callbackId": "提示包所需要的回调ID，事件触发后，提示包将发给此`callbackId:callback`"
            },
            "function": "监听 menuUiShowed 事件(即主菜单UI打开事件)，事件触发后，会发送提示包"
        }
    },
    "event.commandReg.listen": {
        "needData": {
            "callbackId": "string"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }],
            "callback": [{
                "source": "注册插件的meta",
                "commands": "注册的commands的信息"
            }]
        },
        "description": {
            "needData": {
                "callbackId": "提示包所需要的回调ID，事件触发后，提示包将发给此`callbackId:callback`"
            },
            "function": "监听 commandReg 事件(即命令注册事件)，事件触发后，会发送提示包"
        }
    },
    "ui.show": {
        "needData": {
            "triggerName": "string",
            "uiName": "string"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }]
        },
        "description": {
            "needData": {
                "triggerName": "需打开此ui的玩家",
                "uiName": "UI的名称，可选的有:\naboutUi\ntoolUi\nOPToolUi\nsettingUi\ncommandSystemUi\nUDUi"
            },
            "function": "对目标玩家打开UI"
        }
    },
    "user.PluginUser.new": {
        "needData": {
            "UserId": "string"
        },
        "experiment": true,
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }]
        },
        "description": {
            "needData": {
                "UserId": "插件用户的id，用于区分此插件用户和其他插件用户之间的独有ID(这是由您自己设置的)"
            },
            "function": "创建一个新的插件用户，不同插件之间创建的插件用户不会互相干扰"
        }
    },
    "user.PluginUser.sendMail": {
        "needData": {
            "UserId": "string",
            "TargetUser": "obj",
            "Mail": "string"
        },
        "experiment": true,
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }, {
                "type": "Error",
                "message": "TargetUserData not found."
            }, {
                "type": "Error",
                "message": "UserData not found."
            }]
        },
        "description": {
            "needData": {
                "UserId": "已创建的插件用户ID",
                "TargetUser": "目标用户(是一个User对象解析，可以参考\"特殊概念\"中的内容)",
                "Mail": "邮件文本"
            },
            "function": "使插件用户向目标用户发送邮件"
        }
    },
    "System.commandSystem.registr": {
        "needData": {
            "commands": "object"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }]
        },
        "description": {
            "needData": {
                "commands": "命令数据"
            },
            "function": "通过系统权限注册命令"
        }
    },
    "commandSystem.registr": {
        "needData": {
            "commands": "object"
        },
        "experiment": true,
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }]
        },
        "description": {
            "needData": {
                "commands": "object"
            },
            "function": "注册命令"
        },
        "discard": {
            "toUse": "System.commandSystem.registr"
        }
    },
    "System.commandSystem.translationMap.add": {
        "needData": {
            "value": "string",
            "id": "string"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }, {
                "type": "Error",
                "message": "No system level permission."
            }]
        },
        "description": {
            "needData": {
                "value": "translationMap的设定值",
                "id": "translationMap的Id"
            },
            "function": "添加一组 translationMap"
        }
    },
    "System.commandSystem.translationMap.set": {
        "needData": {
            "value": "object"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }, {
                "type": "Error",
                "message": "No system level permission."
            }]
        },
        "description": {
            "needData": {
                "value": "重设后的translationMap"
            },
            "function": "将已有的 translationMap 全部覆盖重设(这包括系统自带)"
        }
    },
    "System.config.get": {
        "needData": {
            "path": "string"
        },
        "experiment": true,
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }, {
                "type": "Error",
                "message": "No system level permission."
            }]
        },
        "description": {
            "needData": {
                "path": "config路径"
            },
            "function": "获取一个config的值"
        }
    },
    "System.config.set": {
        "experiment": true,
        "needData": {
            "path": "string",
            "value": null
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }, {
                "type": "Error",
                "message": "No system level permission."
            }]
        },
        "description": {
            "needData": {
                "path": "config路径",
                "value": "任意类型(?)，设置后的config值"
            },
            "function": "设置一个config的值"
        }
    },
    "System.EventEngine.listen": {
        "experiment": true,
        "needData": {
            "callbackId": "string",
            "id": "string"
        },
        "returnPack": {
            "result": [{
                "type": "Pass",
                "message": "Load Pass"
            }, {
                "type": "Error",
                "message": "No system level permission."
            }],
            "callback": [{
                "?": "这取决于此事件实际的事件返回数据"
            }]
        },
        "description": {
            "needData": {
                "callbackId": "提示包所需要的回调ID，事件触发后，提示包将发给此`callbackId:callback`",
                "id": "欲监听的id名"
            },
            "function": "可以绕过`event`的限制，通过系统权限直接触碰到`EventEngine`，并以此监听任意事件"
        }
    }
}

module.exports.interfaceData = interfaceData;