export function LiveState(data) {
    const listeners = {};

    const notify = (k, v) => {
        const fn = listeners[k];
        if (!fn) return;
        // If it's a single function, call it (True O(1))
        if (typeof fn === 'function') return fn(v);
        // If it's an array (rare), then loop
        for (let i = 0; i < fn.length; i++) fn[i](v);
    };

    return new Proxy(data, {
        get: (t, p) => p === 'on' ? (k, cb) => {
            const current = listeners[k];
            if (!current) {
                listeners[k] = cb; // Store directly as function
            } else if (typeof current === 'function') {
                listeners[k] = [current, cb]; // Upgrade to array only if needed
            } else {
                current.push(cb);
            }
            cb(t[k]);
        } : t[p],
        set: (t, p, v) => { t[p] = v; notify(p, v); return true; }
    });
}

export function LiveArrayState(data) {
    // We initialize the listeners as empty objects {} instead of objects-of-arrays
    const listeners = { set: {}, add: {}, addMany: {}, remove: {}, removeMany: {} };

    // HYPER O(1) EMIT
    function emit(type, key, payload) {
        const fn = listeners[type][key];
        if (!fn) return;

        // Single listener: True O(1) jump
        if (typeof fn === 'function') return fn(payload);

        // Multiple listeners: O(N) fallback
        for (let i = 0; i < fn.length; i++) fn[i](payload);
    }

    const _proto = Array.prototype;
    function upgradeArray(key, arr) {
        Object.defineProperty(arr, 'push', {
            enumerable: false, configurable: true,
            value: function () {
                const res = _proto.push.apply(this, arguments);
                const items = _proto.slice.call(arguments);

                if (arguments.length === 1) {
                    emit('add', key, items[0]);
                } else {
                    emit('addMany', key, items);
                }
                return res;
            }
        });

        Object.defineProperty(arr, 'splice', {
            enumerable: false, configurable: true,
            value: function (i, c) {
                const removed = _proto.slice.call(this, i, i + c);
                const res = _proto.splice.apply(this, arguments);

                if (removed.length === 1) {
                    emit('remove', key, removed[0]);
                } else if (removed.length > 1) {
                    emit('removeMany', key, removed);
                }
                return res;
            }
        });
    }

    // Helper to handle the "Single to Array" listener upgrade
    function register(type, key, cb) {
        const current = listeners[type][key];
        if (!current) {
            listeners[type][key] = cb;
        } else if (typeof current === 'function') {
            listeners[type][key] = [current, cb];
        } else {
            current.push(cb);
        }
    }

    // Standard Getter/Setter loop
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        let val = data[key];
        if (Array.isArray(val)) upgradeArray(key, val);

        Object.defineProperty(data, key, {
            enumerable: true,
            get: function () { return val; },
            set: function (newVal) {
                if (Array.isArray(newVal)) upgradeArray(key, newVal);
                val = newVal;
                emit('set', key, newVal);
            }
        });
    }

    // Public API - O(1) Optimized Registration
    Object.defineProperties(data, {
        on: { value: (k, cb) => { register('set', k, cb); if (data[k]) cb(data[k]); } },
        onAdd: { value: (k, cb) => { register('add', k, cb); } },
        onAddMany: { value: (k, cb) => { register('addMany', k, cb); } },
        onRemove: { value: (k, cb) => { register('remove', k, cb); } },
        onRemoveMany: { value: (k, cb) => { register('removeMany', k, cb); } }
    });

    return data;
}