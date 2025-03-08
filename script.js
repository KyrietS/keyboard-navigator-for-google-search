'use strict';

/**
 * @returns {Array} An array of objects with SearchResults containing {h3, a} properties.
 */
function getGoogleSearchResults() {
    const searchDiv = document.getElementById("search");

    if (!searchDiv) {
        console.log("Did not find element with id 'search'");
        return [];
    }

    // Find all <h3> elements whose parent is an <a> element
    const h3ElementsInsideLink = Array.from(searchDiv.getElementsByTagName("h3")).filter(h3 => h3.parentElement.tagName === "A");

    const searchResults = h3ElementsInsideLink.map(h3 => {
        const a = h3.parentElement;
        return { h3, a };
    });

    return searchResults
        .filter(result => result.h3.offsetParent !== null) // only visible elements
        .filter(result => result.h3.getAttribute("aria-hidden") === null) // only elements without aria-hidden
}

function addCssStylesToThePage() {
    const style = document.createElement("style");
    style.innerHTML = `
    .keyboard-navigator-selected-link::before {
        content: "►";
        margin-right: 25px;
        left: -25px;
        position: absolute;
    }
`;
    document.head.appendChild(style);
}

function selectResult(resultIndex, context) {

    if (resultIndex < 0 || resultIndex >= context.searchResults.length) {
        return false;
    }

    context.selectedResultIndex = resultIndex;

    context.searchResults.forEach((result) => {
        result.h3.classList.remove('keyboard-navigator-selected-link');
    });

    context.searchResults[resultIndex].h3.classList.add('keyboard-navigator-selected-link');
    context.searchResults[resultIndex].a.focus();

    return true;
}

function getQueryText() {
    const url = window.location.href;
    const params = new URL(url).searchParams;
    return params.get("q");
}

(async function () {
    console.log("Keyboard Navigator for Google Search is running");

    addCssStylesToThePage();

    const context = {
        searchResults: getGoogleSearchResults(),
        selectedResultIndex: 0,
    };

    try {
        const settings = await getSettings(defaultSettings);
        if (!selectResult(0, context)) {
            console.log("No search results found.");
        }

        document.addEventListener("keydown", function (event) {
            // check if the focus is in text input
            if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") {
                return;
            }

            if (settings.keysForNextResult.includes(event.key)) {
                if (selectResult(context.selectedResultIndex + 1, context)) {
                    event.preventDefault();
                }
            } else if (settings.keysForPreviousResult.includes(event.key)) {
                if (selectResult(context.selectedResultIndex - 1, context)) {
                    event.preventDefault();
                }
            }

            // Google Search
            else if (settings.keysForGoogleSearch.includes(event.key)) {
                event.preventDefault();
                window.location.href = `https://www.google.com/search?q=${getQueryText()}`;
            }

            // Google Images
            else if (settings.keysForGoogleImages.includes(event.key)) {
                event.preventDefault();
                window.location.href = `https://www.google.com/search?tbm=isch&q=${getQueryText()}`;
            }

            // Google Videos
            else if (settings.keysForGoogleVideos.includes(event.key)) {
                event.preventDefault();
                window.location.href = `https://www.google.com/search?tbm=vid&q=${getQueryText()}`;
            }

            // Google Maps
            else if (settings.keysForGoogleMaps.includes(event.key)) {
                event.preventDefault();
                window.location.href = `https://www.google.com/maps/search/${getQueryText()}`;
            }
        });
    } catch (error) {
        console.error('Failed to get settings:', error);
    }
})();