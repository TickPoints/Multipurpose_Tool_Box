_Tip: 实验中，在未来的版本中可能删除或做过多修改_
_Tip: 需要系统级权限_
# 参数
```
{
    "callbackId": "string",
    "id": "string"
}
```
## callbackId
提示包所需要的回调ID，事件触发后，提示包将发给此<code>callbackId:callback</code>
## id
欲监听的id名
# 功能
可以绕过<code>event</code>的限制，通过系统权限直接触碰到<code>EventEngine</code>，并以此监听任意事件
# 返回包
下面给出包不一定都存在，视情况有所变动

## callback
Id: callback

```

{
    "?": "这取决于此事件实际的事件返回数据"
}

```
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
