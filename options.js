
// Saves options to chrome.storage
const saveOptions = async () => {
    const keysForNextResult = document.getElementById('keysForNextResult').value.split(',');
    const keysForPreviousResult = document.getElementById('keysForPreviousResult').value.split(',');
    const keysForGoogleSearch = document.getElementById('keysForGoogleSearch').value.split(',');
    const keysForGoogleImages = document.getElementById('keysForGoogleImages').value.split(',');
    const keysForGoogleVideos = document.getElementById('keysForGoogleVideos').value.split(',');
    const keysForGoogleMaps = document.getElementById('keysForGoogleMaps').value.split(',');

    const settings = {
        keysForNextResult,
        keysForPreviousResult,
        keysForGoogleSearch,
        keysForGoogleImages,
        keysForGoogleVideos,
        keysForGoogleMaps,
    };

    try {
        await saveSettings(settings);
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
            status.textContent = '';
        }, 2000);
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = async () => {
    try {
        const items = await getSettings(defaultSettings);
        document.getElementById('keysForNextResult').value = items.keysForNextResult.join(',');
        document.getElementById('keysForPreviousResult').value = items.keysForPreviousResult.join(',');
        document.getElementById('keysForGoogleSearch').value = items.keysForGoogleSearch.join(',');
        document.getElementById('keysForGoogleImages').value = items.keysForGoogleImages.join(',');
        document.getElementById('keysForGoogleVideos').value = items.keysForGoogleVideos.join(',');
        document.getElementById('keysForGoogleMaps').value = items.keysForGoogleMaps.join(',');
    } catch (error) {
        console.error('Failed to restore settings:', error);
    }
};

// Resets options to default values
const resetOptions = async () => {
    try {
        await saveSettings(defaultSettings);
        await restoreOptions();
        document.getElementById('keysForNextResult').value = defaultSettings.keysForNextResult.join(',');
        document.getElementById('keysForPreviousResult').value = defaultSettings.keysForPreviousResult.join(',');
        const status = document.getElementById('status');
        status.textContent = 'Options reset to default.';
        setTimeout(() => {
            status.textContent = '';
        }, 2000);
    } catch (error) {
        console.error('Failed to reset settings:', error);
    }
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('optionsForm').addEventListener('submit', (event) => {
    event.preventDefault();
    saveOptions();
});

document.getElementById('reset').addEventListener('click', (event) => {
    event.preventDefault();
    if (confirm('Are you sure you want to reset to default settings?')) {
        resetOptions();
    }
});

console.log('Keyboard Navigator for Google Search options page is running');