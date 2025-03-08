
const getStorage = () => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        return chrome.storage.sync;
    } else if (typeof browser !== 'undefined' && browser.storage) {
        return browser.storage.sync;
    } else {
        throw new Error('No storage API found.');
    }
};

const getLastError = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.lastError) {
        return chrome.runtime.lastError;
    } else if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.lastError) {
        return browser.runtime.lastError;
    }
    return null;
};

const saveSettings = async (settings) => {
    const storage = getStorage();
    return new Promise((resolve, reject) => {
        storage.set(settings, () => {
            const error = getLastError();
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

const getSettings = async (defaultSettings) => {
    const storage = getStorage();
    return new Promise((resolve, reject) => {
        storage.get(defaultSettings, (items) => {
            const error = getLastError();
            if (error) {
                reject(error);
            } else {
                resolve(items);
            }
        });
    });
};
