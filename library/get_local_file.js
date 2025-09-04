/** 
 * Creates a URL object representing a file within a Moodle folder
 * identified using relative URLs, relative to the current script.
 * @param {*} relativePath is a string such as "./filename.css" 
 * */
function getLocalFileURL(relativePath) {
    const currentURL = new URL(document.currentScript.getAttribute("src"));
    return new URL(relativePath, currentURL.toString());
}

