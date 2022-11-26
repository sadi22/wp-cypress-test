/**
 * Add Notification for Success
 * @param Notification
 * @returns {function(): void}
 * @constructor
 */
export function AddSuccessNotification(Notification){
    Notification.event('block');
    const timer = setTimeout(() => {
        Notification.event('none');
    }, 3000);
    return () => clearTimeout(timer);
}

/**
 * Clear Notification
 * @param value
 * @param event
 * @returns {function(): void}
 * @constructor
 */
export function ClearNotification(value,event){
    const timer = setTimeout(() => {
        event(value);
    }, 5000);
    return () => clearTimeout(timer);
}

/**
 * Clear Success Notification
 * Clear Warning Notification
 * @param value
 * @param event
 * @param warring_event
 * @returns {function(): void}
 * @constructor
 */
export function ClearNotificationWithWarring(value,event,warring_event){
    const timer = setTimeout(() => {
        event(value);
        warring_event(value);
    }, 3000);
    return () => clearTimeout(timer);
}

/**
 * Clear Only warning Notification
 * @param value
 * @param event
 * @returns {function(): void}
 * @constructor
 */
export function ClearWarning(value,event){
    const timer = setTimeout(() => {
        event(value);
    }, 3000);
    return () => clearTimeout(timer);
}