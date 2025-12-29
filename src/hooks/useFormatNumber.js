import { useMemo } from 'react';

/**
 * Custom hook to format numbers with commas and abbreviations
 * @param {number|string} value - The number to format
 * @param {Object} options - Formatting options
 * @param {boolean} options.abbreviate - Whether to abbreviate large numbers (K, M, B, T)
 * @param {number} options.decimals - Number of decimal places for abbreviated numbers
 * @param {boolean} options.addCommas - Whether to add commas to non-abbreviated numbers
 * @returns {string} Formatted number string
 */
const useFormatNumber = (value, options = {}) => {
    const {
        abbreviate = true,
        decimals = 1,
        addCommas = true,
    } = options;

    const formattedValue = useMemo(() => {
        // Handle null, undefined, or empty string
        if (value === null || value === undefined || value === '') {
            return '-';
        }

        // Convert to number
        const num = typeof value === 'string' ? parseFloat(value) : value;

        // Check if it's a valid number
        if (isNaN(num)) {
            return '-';
        }

        // If abbreviation is enabled, only abbreviate from Billion onwards
        if (abbreviate) {
            const absNum = Math.abs(num);
            const sign = num < 0 ? '-' : '';

            if (absNum >= 1e12) {
                // Trillion
                return sign + (absNum / 1e12).toFixed(decimals) + 'T';
            } else if (absNum >= 1e9) {
                // Billion
                return sign + (absNum / 1e9).toFixed(decimals) + 'B';
            }
            // For numbers less than 1 billion, fall through to comma formatting
        }

        // For numbers less than 1 billion or if abbreviation is disabled
        if (addCommas) {
            return num.toLocaleString('en-US', {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
            });
        }

        return num.toString();
    }, [value, abbreviate, decimals, addCommas]);

    return formattedValue;
};

export default useFormatNumber;
