# 参数
```
{
    "callbackId": "string"
}
```
## callbackId
提示包所需要的回调ID，事件触发后，提示包将发给此<code>callbackId:callback</code>
# 功能
监听 commandReg 事件(即命令注册事件)，事件触发后，会发送提示包
# 返回包
下面给出包不一定都存在，视情况有所变动

## callback
Id: callback

```

{
    "commands": "注册的commands的信息",
    "source": "注册插件的meta"
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
