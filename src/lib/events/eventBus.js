const eventBus = new EventTarget();

const publish = (eventType, detail = null) => {
    eventBus.dispatchEvent(new CustomEvent(eventType, { detail }));
}

const subscribe = (eventType, eventHandler) => {
    eventBus.addEventListener(eventType, eventHandler);

    const unsubscribe = () => {
        eventBus.removeEventListener(eventType, eventHandler);
    }

    return unsubscribe;
}

export {
    publish,
    subscribe
}