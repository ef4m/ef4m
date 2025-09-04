/**
 * Returns a promise that resolves when the first element within the document 
 * with the selector passed is found, or is rejected if the DOM is loaded and no 
 * element matches the selector.
 * @param {*} selector
 */
function waitForElement(selector) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        document.addEventListener("DOMContentLoaded", function() {
            observer.disconnect();
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
            } else {
                reject("Element not found when DOM was ready");
            }
        });
    });
}