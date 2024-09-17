# 基本
_Tip:User对象解析是<code>API</code>的内容_
```
{
    "type": "string",
    "packId"?: "string",
    "UserId"?: "string",
    "General"?: {
        "method": "string",
        "playerName"?: "string",
        "name"?: "string"
    }
}
```
## type
User对象类型。
* <code>Plugin</code>: <code>PluginUser</code>(同时需要<code>packId</code>和<code>UserId</code>)
* <code>System</code>: <code>SystemUser</code>
* <code>General</code>: 一般用户(同时需要<code>General</code>)

## packId
创建的 PluginUser 所属的插件包Id。

## UserId
创建的 PluginUser 本身Id。

## General
### method
获取方法。
* <code>name</code>: 通过名称获取(同时需要<code>name</code>)
* <code>bind</code>: 通过绑定的玩家获取(同时需要<code>playerName</code>)
### name
用户名。(可获取到"一般用户"和"SystemUser"但无法获得"PluginUser")
### playerName
绑定的玩家名。(只可获取到"一般用户"
