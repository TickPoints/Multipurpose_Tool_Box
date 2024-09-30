_Tip: 实验中，在未来的版本中可能删除或做过多修改_
# 参数
```
{
    "Mail": "string",
    "TargetUser": "obj",
    "UserId": "string"
}
```
## Mail
邮件文本
## TargetUser
目标用户(是一个User对象解析，可以参考"特殊概念"中的内容)
## UserId
已创建的插件用户ID
# 功能
使插件用户向目标用户发送邮件
# 返回包
下面给出包不一定都存在，视情况有所变动

## result
Id: result

```

{
    "message": "Load Pass",
    "type": "Pass"
}

{
    "message": "TargetUserData not found.",
    "type": "Error"
}

{
    "message": "UserData not found.",
    "type": "Error"
}

```
