import { ICookie } from '@rheas/contracts/cookies';
import { dayjs, Redate } from '@rheas/support/redate';
import { SameSite } from '@rheas/contracts/cookies/sameSite';
import { InvalidArgumentException } from '@rheas/errors/invalidArgument';

export class Cookie implements ICookie {
    /**
     * Name of the cookie.
     *
     * @var string
     */
    protected _name: string;

    /**
     * Cookie value
     *
     * @var string
     */
    protected _value: string;

    /**
     * The UNIX timestamp in milliseconds of cookie expiry time.
     *
     * @var number
     */
    protected _expiresAt: number;

    /**
     * The path in server, where this cookie is valid.
     *
     * @var string
     */
    protected _path: string;

    /**
     * The domain where this cookie is valid.
     *
     * @var string
     */
    protected _domain: string;

    /**
     * Flag indicating whether the cookie should be send only through
     * secure connections.
     *
     * @var boolean
     */
    protected _secure: boolean;

    /**
     * Flag indicating whether the cookie should be accessible to Javascript.
     * Setting true, means no access to client side Javascript code.
     *
     * @var boolean
     */
    protected _httpOnly: boolean;

    /**
     * Setting true will not urlencode the cookie name and value.
     *
     * @var boolean
     */
    protected _raw: boolean;

    /**
     * Cookie's same site parameter
     *
     * @var SameSite
     */
    protected _sameSite: SameSite;

    /**
     * Creates a new cookie with the given name. Only name field is
     * mandatory, the rest of the parameters can be populated using setters.
     *
     * A cookie should have a valid name and value field to show up on browser.
     * Setting an empty value will result in an expired cookie, which the browser
     * may not store.
     *
     * @param name
     * @param value
     * @param expire
     * @param path
     * @param domain
     * @param secure
     * @param httpOnly
     * @param raw
     * @param sameSite
     */
    constructor(
        name: string,
        value: string = '',
        expiresAt: number = 0,
        path: string = '/',
        domain: string = '',
        secure: boolean = false,
        httpOnly: boolean = false,
        raw: boolean = true,
        sameSite: SameSite = SameSite.NONE,
    ) {
        this._name = name;
        this._value = value;
        this._expiresAt = expiresAt;
        this._path = path;
        this._domain = domain;
        this._secure = secure;
        this._httpOnly = httpOnly;
        this._raw = raw;
        this._sameSite = sameSite;
    }

    /**
     * Sets a new value for this cookie.
     *
     * @param value
     */
    public setValue(value: string = ''): ICookie {
        this._value = value;

        return this;
    }

    /**
     * Sets the UNIX timestamp in milliseconds at which cookie expires. Set
     * the value to 0 if the cookie should expire when browser closes.
     *
     * @param timestamp
     */
    public setExpire(timestamp: number = 0): ICookie {
        if (timestamp !== 0 && !dayjs(timestamp).isValid()) {
            throw new InvalidArgumentException('An invalid expiry time is given');
        }
        this._expiresAt = timestamp;

        return this;
    }

    /**
     * Sets the expiry time thirteen years back from the current time, causing it
     * become invalid.
     *
     * @returns
     */
    public expire(): ICookie {
        const pastTime = dayjs(Date.now()).subtract(13, 'year').valueOf();

        return this.setExpire(pastTime);
    }

    /**
     * Sets the expiry time thirteen years from now.
     *
     * @returns
     */
    public forever(): ICookie {
        const futureTime = dayjs(Date.now()).add(13, 'year').valueOf();

        return this.setExpire(futureTime);
    }

    /**
     * Sets the cookie path to the given value.
     *
     * @param path
     */
    public setPath(path: string = '/'): ICookie {
        this._path = path;

        return this;
    }

    /**
     * Sets the cookie domain to the given value.
     *
     * @param domain
     */
    public setDomain(domain: string = ''): ICookie {
        this._domain = domain;

        return this;
    }

    /**
     * Sets a new secure flag for the cookie;
     *
     * @param secure
     */
    public setSecure(secure: boolean = false): ICookie {
        this._secure = secure;

        return this;
    }

    /**
     * Sets new flag for the HTTP protocol property.
     *
     * @param httpOnly
     */
    public setHttpOnly(httpOnly: boolean = false): ICookie {
        this._httpOnly = httpOnly;

        return this;
    }

    /**
     * Sets new flag for raw.
     *
     * @param raw
     */
    public setRaw(raw: boolean = true): ICookie {
        this._raw = raw;

        return this;
    }

    /**
     * Sets new sameSite property.
     *
     * @param sameSite
     */
    public setSameSite(sameSite: SameSite = SameSite.NONE): ICookie {
        this._sameSite = sameSite;

        return this;
    }

    /**
     * Returns the cookie name.
     *
     * @returns
     */
    public getName(): string {
        return this._name;
    }

    /**
     * Returns the cookie value.
     *
     * @returns
     */
    public getValue(): string {
        return this._value;
    }

    /**
     * Returns the UNIX timestamp of cookie expiry time or 0 if the cookie
     * should expire when browser closes.
     *
     * @returns
     */
    public getExpiry(): number {
        return this._expiresAt;
    }

    /**
     * Returns the seconds from now till the cookie expires.
     *
     * @returns
     */
    public getMaxAge(): number {
        if (this.getExpiry() === 0) {
            return 0;
        }
        const secondsFromNow = dayjs(this.getExpiry()).diff(dayjs(), 'second');

        return secondsFromNow > 0 ? secondsFromNow : 0;
    }

    /**
     * Returns true if the cookie has already expired.
     *
     * @returns
     */
    public hasExpired(): boolean {
        return this.getMaxAge() === 0;
    }

    /**
     * Returns the path where this cookie is valid.
     *
     * @returns
     */
    public getPath(): string {
        return this._path;
    }

    /**
     * Returns the domain where this cookie is valid.
     *
     * @returns
     */
    public getDomain(): string {
        return this._domain;
    }

    /**
     * Returns true if the cookie has to be transmitted over secure
     * connections only.
     *
     * @returns
     */
    public isSecure(): boolean {
        return this._secure;
    }

    /**
     * Returns true if javascripts should not access the cookie.
     *
     * @returns
     */
    public isHttpOnly(): boolean {
        return this._httpOnly;
    }

    /**
     * Returns the raw flag of this cookie.
     *
     * @returns
     */
    public isRaw(): boolean {
        return this._raw;
    }

    /**
     * Returns the same site property of this cookie.
     *
     * @returns
     */
    public getSameSite(): SameSite {
        return this._sameSite;
    }

    /**
     * Overriden object toString function. Returns the cookie string
     * in the format suitable for Set-Cookie response header.
     *
     * Code referenced from Symfony cookies class.
     *
     * @returns
     */
    public toString() {
        let cookie = this.rawIfNeededOf(this.getName()) + '=';

        // If the value is empty, we will first expire the cookie by
        // setting it's expiry time to something in the past. Also,
        // Max-Age is set to zero.
        if (this.getValue() === '') {
            this.expire();

            cookie += '; expires=' + Redate.responseFormat(this.getExpiry()) + '; Max-Age=0';
        }
        // If the value is not empty, we will set the value and the expiry
        // time formatted in the response date format, and the max-age in
        // seconds.
        else {
            cookie += this.rawIfNeededOf(this.getValue());

            if (this.getExpiry() !== 0) {
                cookie += '; expires=' + Redate.responseFormat(this.getExpiry());
            }

            cookie += '; Max-Age=' + this.getMaxAge();
        }

        if (this.getPath()) {
            cookie += '; path=' + this.getPath();
        }

        if (this.getDomain()) {
            cookie += '; domain=' + this.getDomain();
        }

        if (this.isSecure()) {
            cookie += '; secure';
        }

        if (this.isHttpOnly()) {
            cookie += '; httponly';
        }

        if (SameSite.NONE !== this.getSameSite()) {
            cookie += '; samesite=' + this.getSameSite().valueOf();
        }

        return cookie;
    }

    /**
     * Returns raw value if the cookie is set to take only raw values.
     * Otherwise, a urlencoded value is returned.
     *
     * @param value
     */
    private rawIfNeededOf(value: string): string {
        return this.isRaw() ? value : encodeURIComponent(value);
    }
}
