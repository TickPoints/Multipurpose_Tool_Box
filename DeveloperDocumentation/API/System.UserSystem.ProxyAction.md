_Tip: 实验中，在未来的版本中可能删除或做过多修改_
_Tip: 需要系统级权限_
# 参数
```
{
    "OperationName": "string",
    "OperationParameters": "object",
    "User": "object"
}
```
## OperationName
操作函数的名称
## OperationParameters
带给操作函数的参数(列表形式)
## User
一个用户解析对象
# 功能
以系统权限代理其他用户(任何形式的)，然后通过此用户所有的方法进行操作
# 返回包
下面给出包不一定都存在，视情况有所变动

## error
Id: `error`

```

{
    "error": "<执行时报出的错误>"
}

```
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

{
    "message": "No system level permission.",
    "type": "Error"
}

```
## return
Id: `return`

```

{
    "returnValue": "<执行后的返回值>"
}

```
