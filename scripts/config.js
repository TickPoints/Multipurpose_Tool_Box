// 配置文件
/**
 * 使用注意
 * 除 export const config =  外，内容均应保持JSON语法
 * 每个key均有单行注释提示其作用
 */

export const config = {
    "updata": {
        "tipMail": {
            "receive": true // 接收更新邮件
        }
    },
    "user": {
        "date": "%%8年%%7月%%6号星期%%5，%%4时%%3分", // 日期表达方法，%%1是毫秒，2(接下来开始省略%%)秒，3分钟，4小时，5星期几，6日期，7月份，8年，9从1970 年 1 月 1 日 0 时 0 分 0 秒 UTC 开始到现在的时间间隔（单位：毫秒），本处仅使用3,4,5,6,7,8
        "repair": { // 用以修复意外的操作导致的HOP降级
            "use": false, // 使用修复器
            "name": "Player-?" // 用户名，如 TickPoints 玩家用户名为 Player-TickPoints
        },
        "limitName": {
            "use": true // 强制限制玩家用户名
        }
    },
    "commandSystem": {
        "chat": {
            "id": "!" // 在聊天框执行命令的标识符
        },
        "notUser": {
            "permission": 2 // 为非用户分配权限
        },
        "eventUse": {
            "use": false, // 对非 SystemUser 用户启用 /scriptevent 调用 CommandSystem
            "UIRequest": { // 在 "use" 为 false 时启用
                "use": true, // 当 /scriptevent 被调用时，如果 User 是玩家则对玩家展开UI界面请求，确定是本人操作(防止 /execute 恶意调用)
                "requestPostpone": 10 // 请求延迟，当 UI 打开过后必须等待时间(单位:秒)后才开再次打开，防止循环调用
            }
        }
    },
    "systemPlugins": [
        // 这是接口调用的一组很重要的数据，用于判断插件是否拥有系统级权限，只有在拥有系统级权限的情况下，才能调用系统级接口，这个列表中包含所有使用者已认可的系统级插件(以id为判断，如:TickPoints.CommandSystemExtension)
        "TickPoints.CommandSystemExtension"     // 这里仅用作范例，不使用时请清除
    ]
}