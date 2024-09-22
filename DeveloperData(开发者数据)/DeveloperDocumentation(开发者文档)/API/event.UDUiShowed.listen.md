# 参数
```
{
    "callbackId": "string"
}
```
## callbackId
提示包所需要的回调ID，事件触发后，提示包将发给此```callbackId:callback```
# 功能
监听 UDUiShowed 事件(即开发者文档UI打开事件)，事件触发后，会发送提示包
提示包默认内容如下:```
{
"sourceName"
}```
sourceName是打开的玩家名
# 返回包
下面给出包不一定都存在，视情况有所变动

## result
Id: result

```

{
    "message": "Load Pass",
    "type": "Pass"
}

```
