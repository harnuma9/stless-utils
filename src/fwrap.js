/**
 * Strips the 'name' property from a function and optionally re-assigns it.
 * Can return the function or mutate an object property in-place.
 * 
 * @param {Function} fn - The function to process.
 * @param {Object} [obj=null] - Optional parent object for in-place mutation.
 * @param {string|symbol} [key=null] - Optional property key for in-place mutation.
 * @returns {Function|void} Returns the anonymized function if no obj/key are provided.
 */
export const fwrap = (fn, obj = null, key = null) => {
    try {
        const r = Object.defineProperty(fn, 'name', {
            value: '',
            configurable: true
        });

        // Standalone
        if (null === obj && null === key)
            return r;

        // In-place
        obj[key] = r;

    } catch (e) { return fn; }
};

/**
 * Recursively scans an object to anonymize all functions and optionally freeze it.
 * Automatically respects read-only properties to prevent errors with third-party modules.
 * 
 * @param {Object|Array} obj - The target structure to process.
 * @param {boolean} [isFreeze=true] - Whether to deeply freeze the object after processing.
 * @returns {Object|Array} The processed (and potentially frozen) structure.
 */
export const fwrapObj = (obj, isFreeze = true) => {
    // Return early if null or not an object/array
    if (obj === null || typeof obj !== 'object')
        return obj;

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const val = obj[key];

            // Skip properties that cannot be modified
            const desc = Object.getOwnPropertyDescriptor(obj, key);
            if (desc && desc.writable === false) continue;

            (typeof val === 'function')
                // Delegate naming cleanup and re-assignment to fwrap
                ? fwrap(val, obj, key)

                // Recurse through nested objects/arrays
                : fwrapObj(val, isFreeze);
        }
    }

    // Finalize by locking down the structure if requested
    return isFreeze ? Object.freeze(obj) : obj;
};