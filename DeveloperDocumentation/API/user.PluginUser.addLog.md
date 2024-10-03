_Tip: 实验中，在未来的版本中可能删除或做过多修改_
# 参数
```
{
    "LogMessage": "string",
    "LogName": "string",
    "UserId": "string"
}
```
## LogMessage
需添加的日志记录信息
## LogName
需添加的日志名称
## UserId
已创建的插件用户ID
# 功能
使用插件用户记录日志
# 返回包
下面给出包不一定都存在，视情况有所变动

## result
Id: `result`

```

{
    "message": "Load Pass",
    "type": "Pass"
}

{
    "message": "UserData not found.",
    "type": "Error"
}

```
