/**
 * Write the value to local storage with the key
 * @param {string} key
 * @param {string} value
 */
export const setToStorage = (key, value) => {
	if (typeof window !== "undefined") {
		return window.localStorage.setItem(key, value);
	}
};

/**
 * Get the value from local storage with the key
 * @param {string} key
 */
export const getFromStorage = (key) => {
	if (typeof window !== "undefined") {
		return window.localStorage.getItem(key);
	}
};
