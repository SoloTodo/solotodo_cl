import {constants} from '../config'

export function ga4Event(eventName: string, params: Record<string, any>) {
    for (const gaId of [constants.GA4Id, constants.LGGA4Id]) {
        const fullParams = {
            ...params,
            send_to: gaId
        };
        (window as any).gtag("event", eventName, fullParams)
    }
}