# 参数
```
{
    "RequestCode": "number"
}
```
## RequestCode
请求码，只能为0或1，为0时，会在控制台打印"The test passed."，为1时则会返回包{"result":"The test passed."}
# 功能
一个测试，用于帮助插件确定多用工具包是否正常运行(或者是当前的基础协议是否正常)，如不正常则不会有效
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
## testResult
Id: testResult

```

{
    "result": "The test passed."
}

```
