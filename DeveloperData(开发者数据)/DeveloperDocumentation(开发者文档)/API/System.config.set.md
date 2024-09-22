_Tip: 实验中，在未来的版本中可能删除或做过多修改_
_Tip: 需要系统级权限_
# 参数
```
{
    "path": "string",
    "value": null
}
```
## path
string
## value
null
# 功能
一个测试，用于帮助插件确定多用工具包是否正常运行(或者是当前的基础协议是否正常)，如不正常则不会有效。
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
    "message": "No system level permission.",
    "type": "Error"
}

```
