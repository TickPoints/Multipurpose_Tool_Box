class EventEngine {
    static trigger(eventName, eventData) {
        if (this.EventsCallback[eventName] === undefined) this.EventsCallback[eventName] = [];
        for (let i of this.EventsCallback[eventName]) {
            i(eventData);
        }
    };
    static listen(eventName, func) {
        if (this.EventsCallback[eventName] === undefined) this.EventsCallback[eventName] = [];
        this.EventsCallback[eventName].push(func);
    };
    static EventsCallback = {};
}

export {
    EventEngine
}