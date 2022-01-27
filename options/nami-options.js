if (typeof(namiOpts) == undefined) {
	var namiOpts = {}
}

var namiOpts = {
	dbug : true,
	downkeys : {"d" : null},
	usingTmp : false,
	controls : {
		"devSection" : null,
		"dbugChk" : null,
		"syncURL" : null,
		"saveBtn" : null,
		"cancelBtn" : null,
		"restoreDefaultsBtn" : null
	},
	init : function () {

		for (var control in namiOpts.controls) {
			namiOpts.controls[control] = document.getElementById(control);
		}
		//nami.addToPostLoad([namiOpts.fillValues]);
		namiOpts.controls["restoreDefaultsBtn"].addEventListener("click", namiOpts.restoreDefaults,false);
		namiOpts.controls["saveBtn"].addEventListener("click", namiOpts.save,false);
		namiOpts.controls["cancelBtn"].addEventListener("click", namiOpts.cancel,false);

		document.addEventListener("keydown", namiOpts.checkKeys, false);
		if (namiOpts.usingTmp) {
			if (namiOpts.dbug) console.log ("usingTmp is true.  Creating Undo button.");
			namiOpts.createUndoBtn();
		} else {
			if (namiOpts.dbug) console.log ("usingTmp is false.  Not creating Undo button.");
		}
	}, // End of init
	save : function () {
		// Gather stuff somehow, then save it.
		namiOpts.saveOptions();
		if (namiOpts.usingTmp) {
			var removing = browser.storage.local.remove("nami-temp");
			removing.then(function () {
				namiOpts.usingTmp = false;
				// Need a way to tell the user that, and maybe reload the page
				undoBtn.setAttribute("disabled", "disabled");
				//var msg = nami.createHTMLElement(document, "p", {"id":"msgP", "parentNode":dateSelectorDiv, "tabindex":"-1", "textNode":"Changes have been undone.  Refresh the screen for change to take effect."});
			}, nami.errorFun);
		}
	}, // End of save
	saveOptions : function () {
		// Gather options from the form
		nami.options["dbug"] = namiOpts.controls["dbugChk"].checked;
		nami.options["syncFormURL"] = namiOpts.controls["syncURL"].value;


		browser.storage.local.set({"namiOptions": nami.options}).then(function () { if (nami.options["dbug"]) console.log ("Saved!");}, nami.errorFun);
		browser.runtime.sendMessage({"msg":"Updating options", "task" : "updateOptions", "options" : nami.options});
	}, // End of saveOptions
	fillValues : function () {
		if (namiOpts.dbug) console.log ("Filling form values.");
		// Fill the forms and stuff
		namiOpts.dbug = nami.options.dbug;
		if (nami.options.dbug === true) {
			namiOpts.controls["dbugChk"].setAttribute("checked", "checked");
			namiOpts.showDevSection();
		}
	}, // End of fillValues
	restoreDefaults : function () {
		/* Do stuff to restore defaults */
		if (namiOpts.dbug) console.log ("Restoring defaults.");
	}, // End of restoreDefaults
	cancel : function () {
		/* put stuff back */
		if (namiOpts.dbug) console.log ("Cancelling and setting stuff back to original values.");
	}, // End of cancel
	checkKeys : function (e) {
		if (namiOpts.dbug) console.log ("Key down: " + e.keyCode + ".");
		if (e.keyCode == 68) {
			document.removeEventListener("keypressed", namiOpts.checkKeys);
			document.addEventListener("keyup", namiOpts.checkUpKey, false);

			if (e.keyCode == 68) {
				if (!namiOpts.downkeys["d"]) {
					namiOpts.downkeys["d"] = (new Date()).getTime();
				}
			}
		}
	}, // End of checkKeys
	checkUpKey : function (e) {
		if (namiOpts.dbug) console.log ("Key up: " + e.keyCode + ".");
		if (e.keyCode == 68) {
			document.removeEventListener("keyup", namiOpts.checkUpKey);
			document.addEventListener("keypressed", namiOpts.checkKeys, false);
			
			var keyUpTime = (new Date()).getTime();
			if (e.keyCode == 68) {
				var eTime = keyUpTime - namiOpts.downkeys["d"];
				if (eTime > 900) {
					// toggle devSection
					namiOpts.showDevSection();
				}
				namiOpts.downkeys["d"] = null;
			}
		}
		
	}, // End of checkUpKey
	showDevSection : function () {
		if (namiOpts.controls["devSection"].style.display == "none" || namiOpts.controls["devSection"].style.display == "") {
			namiOpts.controls["devSection"].style.display = "block";
		} else {
			namiOpts.controls["devSection"].style.display = "none";
		}
	}, // End of showDevSection
createOptionsHTMLElement : function (creator, type, attribs) {
		if (namiOpts.dbug) console.log("namiOpts::createOptionsHTMLElement Creator is " + creator + ".");

		var newEl = creator.createElement(type);
		for (var k in attribs) {
			if (namiOpts.dbug) console.log ("Checking attrib " + k + ".");
			if (k == "parentNode") { // && attribs[k] instanceof HTMLElement) {
				if (namiOpts.dbug) console.log("Dealing with parentnode.");
				var parentNode = nami.getHTMLElement(creator, attribs[k], namiOpts.dbug);
				try {
					if (attribs.hasOwnProperty("insertBefore")) {
						var beforeEl = nami.getHTMLElement(creator, attribs["insertBefore"], namiOpts.dbug);
						parentNode.insertBefore(newEl, beforeEl);
					} else if (attribs.hasOwnProperty("insertAfter")) {
						var afterEl = nami.getHTMLElement(creator, attribs["insertAfter"], namiOpts.dbug);
						parentNode.insertBefore(newEl, afterEl.nextSibling);
					} else {
						parentNode.appendChild(newEl);
					}
				}
				catch (er) {
					console.error("Error appending newEl to parentNode: " + er.message + ".");
				}
			} else if (k == "textNode" || k == "nodeText") {
				if (typeof (attribs[k]) == "string") {
					newEl.appendChild(creator.createTextNode(attribs[k]));
				} else if (attribs[k] instanceof HTMLElement) {
					newEl.appendChild(attribs[k]);
				} else {
					newEl.appendChild(creator.createTextNode(attribs[k].toString()));
				}
			} else {
				newEl.setAttribute(k, attribs[k]);
			}
		}
		return newEl;
	}, // End of createOptionsHTMLElement
}
if (namiOpts.dbug) console.log ("namiOpts loaded.");

nami.addToPostLoad([function () {namiOpts.dbug = nami.dbug;}]);