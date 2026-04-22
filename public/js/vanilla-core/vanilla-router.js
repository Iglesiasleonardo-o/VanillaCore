/**
 * Matches the current browser pathname against the defined routes map.
 * @param {Object} routesMap - The map of routes (e.g., app.routes).
 * @returns {string} The matched route string (e.g., "/users/:id") or "/404".
 */
export function matchPathname(routes) {
    if (location.pathname in routes) {
        return location.pathname;
    }

    const parametedPathname = location.pathname.substring(1).split('/'); //may be parameter route
    const length = parametedPathname.length;

    for (const _pathname in routes) {
        const pathname = _pathname.substring(1).split('/');

        if (pathname.length !== length) //pathname wont match
            continue;

        for (let i = 0; i < length; i++) {
            const splitedBrowserPathname = parametedPathname[i];
            const splitedPathname = pathname[i];

            if (splitedPathname[0] !== ':' && splitedBrowserPathname !== splitedPathname) //did not match
                break;

            if (i + 1 == length)
                return _pathname;
        }
    }

    return "/404"; // Not found
    // throw Error(location.pathname + ' route is not set');
}