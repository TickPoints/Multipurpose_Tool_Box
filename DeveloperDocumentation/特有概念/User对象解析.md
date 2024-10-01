# 基本
_Tip:User对象解析是[API](../API.md)的内容_
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
|名称|注释|
|:---:|:---:|
|`Plugin`|`PluginUser`(同时需要`packId`和`UserId`)|
|`System`|`SystemUser`|
|`General`|一般用户(同时需要`General`)|

## packId
创建的 PluginUser 所属的插件包Id。

## UserId
创建的 PluginUser 本身Id。

## General
### method
获取方法。
* `name`: 通过名称获取(同时需要`name`)
* `bind`: 通过绑定的玩家获取(同时需要`playerName`)
### name
用户名。(可获取到"一般用户"和"SystemUser"但无法获得"PluginUser")
### playerName
绑定的玩家名。(只可获取到"一般用户")
