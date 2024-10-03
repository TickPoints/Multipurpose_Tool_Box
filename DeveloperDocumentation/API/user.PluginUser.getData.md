_Tip: 实验中，在未来的版本中可能删除或做过多修改_
# 参数
```
{
    "UserId": "string"
}
```
## UserId
已创建的插件用户ID
# 功能
获取插件用户的数据

[插件用户数据库结构](../用户系统.md#插件用户)
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
## userData
Id: `userData`

```

{
    "?": "详见`插件用户数据库结构`"
}

```
