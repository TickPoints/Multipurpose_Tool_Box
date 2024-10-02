_Tip: 实验中，在未来的版本中可能删除或做过多修改_
# 参数
```
{
    "data": "object",
    "UserId": "string"
}
```
## data
需设置的用户数据
## UserId
已创建的插件用户ID
# 功能
_Tip: 这是危险的_

它可以重设插件用户内部的所有数据，甚至可能导致插件用户无法使用，为了安全考虑，您可以先读取(使用`user.Plugin.getData`)再在读取的数据上进行更改
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
    "message": "UserData not found.",
    "type": "Error"
}

```
