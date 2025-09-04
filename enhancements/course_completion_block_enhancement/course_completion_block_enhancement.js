(function(){
function getLocalFileURL(relativePath) {
    const currentURL = new URL(document.currentScript.getAttribute("src"));
    return new URL(relativePath, currentURL.toString());
}

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

function appendStylesheet(url, blocking) {
    const link = document.createElement("link");
    link.href = url;
    link.rel = "stylesheet";
    if(blocking===true) {
        link.setAttribute("blocking", "render");
    }
    document.head.appendChild(link);
}

const completionProgressBarTemplate = `<tr>
    <td colspan="2">
        <div class="d-flex">
            <strong>Progress</strong>
            <div class="progressCompletionHolder">
                <div class="progress">
                    <div role="progressbar" style="width: {{val}}%; min-width: 2em;" aria-valuenow="{{val}}" aria-valuemin="0" aria-valuemax="100" class="border-0 progress-bar bg-{{bgcolor}}">{{val}}%</div>
                </div>
            </div>
        </div>
    </td>
</tr>`;

waitForElement("section.block_completionstatus")
.then(completionBlock=>{
    const styleURL = getLocalFileURL("./course_completion_block_enhancement.css");
    appendStylesheet(styleURL);

    let cctable = completionBlock.querySelector("table");
    let completionStats = cctable.querySelector("tr.lastrow td.lastcol").textContent.replace(" of ", "/").split("/");
    let percentage = completionStats.length == 2 ? (100 * Number.parseInt(completionStats[0]) / parseInt(completionStats[1])).toFixed(0) : -1;
    let bgcolor = percentage > 0 ? "success" : "danger";
    cctable.querySelector("tbody tr").insertAdjacentHTML("afterend", completionProgressBarTemplate.replaceAll("{{val}}", percentage).replaceAll("{{bgcolor}}", bgcolor));
})
.catch(err=>{
    document.currentScript.insertAdjacentHTML("afterend", "<div class='alert alert-info'>Not in use</div>");
});
}());
