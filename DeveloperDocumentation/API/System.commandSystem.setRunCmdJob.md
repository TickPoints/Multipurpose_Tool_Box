_Tip: 需要系统级权限_
# 参数
```
{
    "jobData": "string"
}
```
## jobData
要修改的runcmd函数的.toString()形式
# 功能
修改runcmd方法

不要直接尝试去调用外部的方法，那是危险的，此方法的危险性极高，可能会破坏系统安全
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
