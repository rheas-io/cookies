import { CookiesManager } from './cookiesManager';
import { ServiceProvider } from '@rheas/services';
import { InstanceHandler } from '@rheas/contracts/container';

export class CookieServiceProvider extends ServiceProvider {
    /**
     * Returns the cookies service resolver. The service returns
     * a cookies manager which parses incoming cookies, adds new
     * one's to the queue etc. Cookies service is registered on the
     * request cycle.
     *
     * @returns
     */
    public serviceResolver(): InstanceHandler {
        return () => new CookiesManager();
    }
}
