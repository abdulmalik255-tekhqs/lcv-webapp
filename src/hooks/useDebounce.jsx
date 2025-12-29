/**
 * Returns a debounced version of the given function which will postpone
 * its execution until after wait milliseconds have elapsed since the last time it was invoked.
 *
 * @param fn the function to debounce
 * @param wait number of milliseconds to wait before invoking the function
 */
function useDebounce(fn, wait) {
    let timeout = null;

    return function debounced(...args) {
        const later = () => {
            timeout = null;
            fn.apply(this, args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

export default useDebounce;
