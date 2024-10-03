const path = "textures/";

const data = {
    infoSource: "Tool",
    logInfoSource: "Log",
    menu: {
        ui: {
            title: "§e§l工具菜单",
            body: "欢迎使用工具菜单，本工具由§eTickPoints§r制作",
            button: [{
                name: "常规功能",
                image: path + "ui/clock"
            }, {
                name: "OP功能",
                image: path + "ui/permissions_op_crown_hover"
            }, {
                name: "内置功能",
                image: path + "ui/inventory_icon"
            }, {
                name: "关于工具",
                image: path + "ui/infobulb"
            }]
        }
    },
    about: {
        ui: {
            title: "关于工具",
            body: "查看有关的选项",
            button: [{
                name: "使用文档",
                image: path + "ui/recipe_book_icon"
            }, {
                name: "查看许可证",
                image: path + "ui/text_color_paintbrush_overlay"
            }, {
                name: "命令",
                image: path + "blocks/command_block"
            }, {
                name: "设置",
                image: path + "ui/settings_glyph_2x"
            }]
        }
    },
    builtIn: {
        ui: {
            title: "内置功能",
            body: "请选择内置功能",
            button: [{
                name: "邮件",
                image: path + "ui/message" // Old:path + "ui/mail_icon"
            }, {
                name: "权限",
                image: path + "ui/video_glyph_2x"
            }, {
                name: "日志",
                image: path + "items/book_writable"
            }]
        },
        permissionManagement: {
            chPlayer: {
                title: "选择目标玩家以查看"
            },
            noright: "您无权执行此操作",
            failureRaiseRight: "无法将其提升至此水平",
            operationSuccessful: [
                "-提权: 操作成功",
                "-隐藏: 操作成功"
            ],
            ui: {
                title: "权限操作及查看",
                slider: [{
                    name: "权限等级",
                    min: 0,
                    max: 6,
                    valueStep: 1
                }],
                toggle: [{
                    name: "使此玩家对低等级隐藏权限查看"
                }],
                submit: "修改(仅查看请按退出)"
            }
        },
        log: {
            ui: {
                title: "日志",
                body: "查看日志",
                button: [{
                    name: "添加Log"
                }, {
                    name: "Log-%%s"
                }]
            },
            add: {
                tip: "第一行充作日志名(log至少需2行)",
                info: "添加Log成功",
                error: "Log输入错误，请检查Log具体情况"
            },
            operationUI: {
                title: "查看或操作",
                body: "§lLog-%%1§r\n记录: %%2\n记录员: %%3\n时间: %%4\nUuid: %%5",
                button: [{
                    name: "删除",
                    image: ""
                }]
            }
        },
        mailServices: {
            chPlayer: {
                title: "选择目标玩家以编写邮件"
            },
            ask: {
                title: "确认邮件",
                body: "您将向 §e%%1 §r发送\n%%2\n确认上述邮件吗?\n(Yes 将发送，其它均将退出)"
            },
            send: {
                player: "已成功发送",
                target: "亲爱的 %%s 玩家，您有一封信件。"
            },
            uptip: "已收到官方的更新邮件。",
            ui: {
                title: "选择邮件服务",
                body: "请选择您需要的邮件服务",
                button: [{
                    name: "发送邮件",
                    image: path + "ui/chat_send"
                }, {
                    name: "查看收件箱",
                    image: path + "blocks/ender_chest_front"
                }]
            },
            IncomingMail: {
                ui: {
                    title: "收件箱",
                    body: "浏览您的邮件",
                    button: "来自 %%1 的邮件(%%2)",  // 邮件选择按钮
                    buttons: [{ // 功能性按钮
                        name: "清空邮件箱",
                        image: ""
                    }]
                },
                operationUI: {
                    title: "邮件",
                    body: "来源: %%1\n接收: %%2\n内容: %%3\n时间: %%4\nUuid: %%5\n接下来您可以进行您的操作。",
                    button: [{
                        name: "回信",
                        image: ""
                    }, {
                        name: "删除(对方仍留有记录)",
                        image: ""
                    }]
                },
                clear: {    // 清空邮件相功能相关
                    title: "清空您的邮件箱?",
                    body: "您确定要清空您的邮件箱吗?"
                }
            },
            source: "mailServices"
        },
        multiIineTextEditing: {
            ui: {
                title: "多行文本编辑噐",
                textField: [{
                    name: "第 %%s 行",
                    text: "在此键入文字"
                }],
                slider: [{
                    name: "添加行数",
                    min: 0,
                    max: 6,
                    valueStep: 1,
                    defaultValue: 0
                }],
                toggle: [{
                    name: "确认"
                }],
                submit: "继续"
            }
        }
    },
    tool: {
        ui: {
            title: "常规功能",
            debug: "当前没有可用的功能项",
            mes: "请选择功能",
            button: [{
                name: "退出",
                image: path + "ui/crossout"
            }]
        }
    },
    OPTool: {
        ui: {
            title: "OP功能",
            debug: "当前没有可用的功能项",
            mes: "§e请选择OP功能",
            button: [{
                name: "退出",
                image: path + "ui/crossout"
            }]
        }
    },
    UD: {
        ui: {
            title: "使用文档",
            button: [
                "我已知晓",
                "返回"
            ]
        }
    },
    commandSystem: {
        ui: {
            title: "命令",
            textField: [{
                name: "输入命令",
                text: "在此输入命令"
            }],
            submitButton: {
                name: "运行"
            }
        },
        eventUse: {
            ui: {
                title: "请求执行",
                body: "有人(可能是您)想要执行命令，是否许可"
            }
        }
    },
    setting: {
        ui: {
            title: "设置",
            debug: "当前没有可用的功能项",
            mes: "请选择设置功能",
            button: [{
                name: "退出",
                image: path + "ui/crossout"
            }]
        }
    },
    License: {
        ui: {
            title: "许可证",
            button: [
                "我已知晓",
                "返回"
            ]
        }
    },
    version: {
        mode: "stable", // stable or experiment
        code: "0.1.73",
        uptip: "§f更新Tip:\n版号:§a0.1.73\n§a适配提供:测试版支持: 1.21.30.21 至 1.21.30.25\n正式版支持: 1.21.30 至 1.22.32§r"
    }
};

const debugMes = {
    hopSet: "您已成功成为最高管理员",
    hopSetErr: "最高管理员已被设置，您无法成为最高管理员",
    hopUIErr: "您不是最高管理员，无权打开",
    command: {
        tryRun: {
            true: "预执行成功",
            false: "预执行失败"
        },
        input: {
            typeErr: "命令执行类型错误"
        }
    },
    op: {
        ui: {
            openErr: "您无权打开"
        }
    },
    repairTip: "已修复意外降级操作",
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
                dataUninitialized: "DataPack.packData的解释错误: 主数据不存在"
            }
        },
        load: {
            objectLost: "Id 为 %%1 的插件: 接口的调用错误: 需要使用的对象 %%2 不存在",
            objectTypeError: "Id 为 %%1 的插件: 接口的调用错误: 需要使用的对象 %%2 类型错误，应该为 %%3",
            notFound: "Id 为 %%1 的插件: 接口的调用错误: 其调用的接口 %%2 不存在"
        }
    }
};

let UDText = `欢迎使用 多用工具箱，本工具箱本身是一个管理系统，仅有少量功能，通过注册的方式，就可以使本工具管理这些插件\n您可以通过一个tool:menu来打开菜单，用/function getHighestOP来获得最高管理\n多用工具箱 提供了一个完善的环境，功能注册，配置，命令，用户系统以及配套API工具，免去了开发者对这些功能的复杂开发。\n本包以GPL3.0.0/later协议开源，但只有直接自本包获取代码并做修改的受GPL协议限制，为本包制作插件或在其它处展示本包功能的不受GPL协议约束请放心使用。\n最后感谢您的使用\n\n版本:${data.version.code}(${data.version.mode})\n作者:TickPoints`;

let LicenseText = "Multipurpose tool box provides a complete environment, including function registration, configuration, command, user system and supporting API tools, eliminating the complex development of these functions by developers, so that developers can operate more conveniently.\nCopyright (C) 2024  TickPoints\nThis program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.\nThis program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.\nYou should have received a copy of the GNU General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>."

export {
    data,
    debugMes,
    UDText,
    LicenseText
};