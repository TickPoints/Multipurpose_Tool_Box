/**
 * 当SDK与多用工具包数据互通请求超时会产生这个错误
 */
class RequestTimeoutError extends Error {
    constructor(message = "The request has exceeded the time limit.", code = -1) {
        super(message);
        this.name = "RequestTimeoutError";
        this.code = code;
    }
}
/**
 * 多用工具包传回的错误提示
 */
class InterfaceCallError extends Error {
    constructor(message, code = -1) {
        super(message);
        this.name = "InterfaceCallError";
        this.code = code;
    }
}

export {
    RequestTimeoutError,
    InterfaceCallError
}