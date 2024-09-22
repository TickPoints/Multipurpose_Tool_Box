# 参数
```
{
    "callbackId": "string"
}
```
## callbackId
提示包所需要的回调ID，事件触发后，提示包将发给此```callbackId:callback```
# 功能
监听 OPUiShowed 事件(即OP工具UI打开事件)，事件触发后，会发送提示包
# 返回包
下面给出包不一定都存在，视情况有所变动

## callback
Id: callback

```

{
    "sourceName": "打开UI的玩家名称"
}

```
## result
Id: result

```

{
    "message": "Load Pass",
    "type": "Pass"
}

```
