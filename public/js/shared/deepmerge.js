export function deepmerge(target, source, options = {}) {
    const {
        arrayMerge = mergeArrays,
        clone = true,
        customMerge = null,
        isMergeableObject = isPlainObject,
    } = options;

    if (!isMergeableObject(target)) {
        return clone ? deepCopy(source) : source;
    }

    if (!isMergeableObject(source)) {
        return clone ? deepCopy(source) : source;
    }

    const result = clone ? deepCopy(target) : { ...target };

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key];
            const targetValue = result[key];

            // Custom merge function for this key
            if (customMerge && typeof customMerge === "function") {
                const customResult = customMerge(key, targetValue, sourceValue);
                if (typeof customResult !== "undefined") {
                    result[key] = customResult;
                    continue;
                }
            }

            if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
                result[key] = arrayMerge(targetValue, sourceValue, options);
            } else if (
                isMergeableObject(sourceValue) &&
                isMergeableObject(targetValue)
            ) {
                result[key] = deepmerge(targetValue, sourceValue, options);
            } else {
                result[key] = clone ? deepCopy(sourceValue) : sourceValue;
            }
        }
    }

    return result;
}

function isPlainObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}

function deepCopy(value) {
    if (value === null || typeof value !== "object") {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map((item) => deepCopy(item));
    }

    const cloned = {};
    for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
            cloned[key] = deepCopy(value[key]);
        }
    }
    return cloned;
}

function mergeArrays(target, source, options) {
    const { clone = true } = options;
    const result = clone ? [...target] : target;

    for (const item of source) {
        result.push(clone ? deepCopy(item) : item);
    }

    return result;
}

// Alternative array merge strategies
const arrayMergeStrategies = {
    // Replace target array with source array
    replace: (_, source) => [...source],

    // Concat arrays (default)
    concat: (target, source) => [...target, ...source],

    // Merge by index position
    mergeByIndex: (target, source, options) => {
        const maxLength = Math.max(target.length, source.length);
        const result = [];

        for (let i = 0; i < maxLength; i++) {
            if (i < target.length && i < source.length) {
                if (isPlainObject(target[i]) && isPlainObject(source[i])) {
                    result.push(deepmerge(target[i], source[i], options));
                } else {
                    result.push(source[i]);
                }
            } else if (i < source.length) {
                result.push(options.clone ? deepCopy(source[i]) : source[i]);
            } else {
                result.push(options.clone ? deepCopy(target[i]) : target[i]);
            }
        }

        return result;
    },
};
