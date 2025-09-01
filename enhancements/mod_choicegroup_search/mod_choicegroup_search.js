(function() {
	/* Add library functions */
    function preloadContent(href, type) {
        const preloadLink = document.createElement("link");
        preloadLink.href = href;
        preloadLink.rel = "preload";
        if (typeof(type) == "undefined") {
            type = "fetch";
        }
        preloadLink.setAttribute("as", type);
        if (type == "fetch") {
            preloadLink.setAttribute("crossorigin", "use-credentials");
        }
        document.head.appendChild(preloadLink);
    }

	function appendStylesheet(url, blocking) {
        const link = document.createElement("link");
        link.href = url;
        link.rel = "stylesheet";
		if(blocking==true) {
			link.setAttribute("blocking", "render");
		}
        document.head.appendChild(link);
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
	/* End of library functions */

	//Generate style URL from the URL of this script - assume the css file is in the same folder resource, in the same level as this script
	const currentURL = new URL(document.currentScript.getAttribute("src"));
    const styleURL = new URL("./mod_choicegroup_search.css", currentURL.toString());
    preloadContent(styleURL, "style");

	//This is the boilerplate HTML we will insert to the page
	const schoolSelectedInject =`<div class="d-flex"><strong>Your school is:</strong> <span class="ps-1" id="schoolSelected">(None selected)</span></div>`;
    const filterInject = `<div class="form-group" id="searchFormComponent">
    <label for="namefilter">Search by school name or URN</label>
	<small id="filterHelp" class="form-text text-muted">Type your school URN or start typing your school name.</small>
    <input type="text" class="form-control" id="namefilter" aria-describedby="filterlHelp" data-ddg-inputtype="unknown" data-initial-value="">
  </div>`;

	

	waitForElement("div.tablecontainer:has(table.choicegroups)").then(tableContainer=>{
		//insert boilerplate HTML
        tableContainer.insertAdjacentHTML("beforebegin", schoolSelectedInject);
		tableContainer.insertAdjacentHTML("beforebegin", filterInject);
        //reference the search element
		const filterInput = document.getElementById('namefilter');
        
		//get labels of all the groups in the choice group table
		const labels = document.querySelectorAll("table.choicegroups td>label")

		//use an attribute to store the original group name and clean up school names removing the school URN
        labels.forEach(l => {
            l.setAttribute("data-schoolname", l.textContent);
            l.textContent = l.textContent.substring(l.textContent.indexOf("|") + 1);
        })

		//listen for user typing in the search field
        filterInput.addEventListener('input', () => {
            const query = filterInput.value.toLowerCase();

			//go through all school labels and show/hide rows containing relevant labels 
            for (let label of labels) {
                const labelText = label.getAttribute("data-schoolname").toLowerCase();
                if (query.length < 2 || labelText.includes(query)) {
                    label.closest("tr.option").style.display = '';
                } else {
                    label.closest("tr.option").style.display = 'none';
                }
            }
        });

		//listen for changes to the group choice
		document.querySelector("table.choicegroups").addEventListener("change", function(e){
			document.getElementById("schoolSelected").textContent = document.querySelector("label[for='"+e.target.id+"']").textContent;
		});

		//If there is a selection already, show it as selected school
		const selectedGroup = document.querySelector("tr:has(input[type='radio']:checked)");
		if(selectedGroup!=null)
		{
			document.getElementById("schoolSelected").textContent = selectedGroup.querySelector("label").textContent;
	
		}

	});
    
    appendStylesheet(styleURL, true);
}());