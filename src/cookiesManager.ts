import { Cookie } from './cookie';
import { KeyValue, IRequest } from '@rheas/contracts';
import { ICookie, ICookieManager } from '@rheas/contracts/cookies';

export class CookiesManager implements ICookieManager {
    /**
     * Caches all the incoming cookies.
     *
     * @var Object
     */
    protected _incoming: KeyValue<ICookie> = {};

    /**
     * Object holding the queues that has to be sent with the
     * response.
     *
     * @var Object
     */
    protected _queue: KeyValue<ICookie> = {};

    /**
     * Creates a cookie manager for the current request.
     *
     * The manager parses all the incoming cookies immediately and
     * stores it in the _incoming variable.
     *
     * @param request
     */
    constructor(request: IRequest) {
        this.parseIncomingCookies(request.headers.cookie || '');
    }

    /**
     * Parses an array of cookie strings.
     *
     * NodeJs Http module parses cookies in a single header in the format
     * name=value; name1=value1; name2=value2 for three different cookies.
     * We will parse each one into a cookie object and caches it in the
     * `_incoming` property.
     *
     * @param cookieHeader
     */
    public parseIncomingCookies(cookieHeader: string): ICookieManager {
        const cookies = cookieHeader.split(';');

        cookies.forEach((cookieString) => {
            const cookie = this.parseCookie(cookieString);

            if (cookie !== null) {
                this._incoming[cookie.getName()] = cookie;
            }
        });

        return this;
    }

    /**
     * Parses a cookie string into a ICookie object. If the name of the cookie
     * is empty, null is returned instead of an ICookie object.
     *
     * @param cookie
     */
    public parseCookie(cookie: string): ICookie | null {
        const keyValue = cookie.split('=');

        // There could be whitescpace on the left end because of the
        // format -> name=value; name1=value1; name2=value2
        // So we will trim them before decoding.
        const name = decodeURIComponent((keyValue.shift() || '').trimLeft());

        if (name === '') {
            return null;
        }
        return new Cookie(name, decodeURIComponent(keyValue.shift() || ''));
    }

    /**
     * Returns true if a cookie with the given name is queued for
     * sending.
     *
     * @param name
     */
    public hasQueued(name: string): boolean {
        return this._queue[name] instanceof Cookie;
    }

    /**
     * Adds a cookie to the queue. This will be send along with the
     * response.
     *
     * @param cookie
     */
    public queue(cookie: ICookie): ICookieManager {
        this._queue[cookie.getName()] = cookie;

        return this;
    }

    /**
     * Deletes a cookie from the queue.
     *
     * @param name
     */
    public unqueue(name: string): void {
        delete this._queue[name];
    }

    /**
     * Returns the incoming cookie value.
     *
     * @param name
     */
    public incoming(name: string): ICookie | null {
        return this._incoming[name] || null;
    }

    /**
     * Returns the queued cookie value.
     *
     * @param name
     */
    public queued(name: string): ICookie | null {
        return this._queue[name] || null;
    }

    /**
     * Returns all the parsed incoming cookies as key value dictionary.
     *
     * @returns
     */
    public incomingCookies(): KeyValue<ICookie> {
        return this._incoming;
    }

    /**
     * Returns all the queued cookies as key-value dictionary.
     *
     * @returns
     */
    public queuedCookies(): KeyValue<ICookie> {
        return this._queue;
    }

    /**
     * Returns a cookie value for the given name. Queued cookies
     * takes precedence over the incoming cookies. If no cookie is
     * found, defaultValue is used.
     *
     * //TODO handle case when cookie is empty ie, whether to return
     * `defaultValue` or empty string when the cookie value is empty.
     *
     * @param key
     * @param defaultValue
     */
    public get(key: string, defaultValue: ICookie | null = null): ICookie | null {
        let value = this.queued(key);

        if (null === value) {
            value = this.incoming(key);
        }
        return value ?? defaultValue;
    }
}
