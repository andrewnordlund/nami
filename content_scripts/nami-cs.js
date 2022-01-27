var namiCS = {
	dbug : nami.dbug,
	usingTmp : false,
	init : function () {
	}, // End of init
	
	startup : function () {
	}, // End of startup
	notify : function (message) {
		if (namiCS.dbug) console.log ("namiCS::Got a message: " + message["msg"] + ", task: " + message["task"] + "."); // from " + message["pageURL"]);
		let head = null;
		head = document.getElementsByTagName("head");
		if (head) {
			if (namiCS.dbug) console.log ("Got head.");
			head = head[0];
			let namiFS = document.createElement("script");
			namiFS.setAttribute("id", "namiFS");
			namiFS.setAttribute("src", "moz-extension://aedc443d-896c-4eef-b7d8-ae360fb122a5/content_scripts/namiFS.js");
			head.appendChild(namiFS);
		} else {
			if (namiCS.dbug) console.log ("Didn't get head.");
		}
		/* 
		   // deal with tasks here
		if (message["task"] == "someTask") {
		}
		*/
	}, // End of notify
} // End of namiCS

document.addEventListener("DOMContentLoaded", function () {
	if (namiCS.dbug) console.log ("Content loaded, getting stored stuff.");
	//nami.getSaved(namiCS.startup, nami.errorFun);

	var getting = browser.storage.local.get("nami-temp");
	getting.then(function (savedObj) {
		if (namiCS.dbug) console.log ("Got stored stuff from -temp.");
		if (nami.countObjs(savedObj) == 0) {
			if (namiCS.dbug) console.log ("But there ain't no temp info there.");
			nami.getSaved(namiCS.startup, nami.errorFun);
		} else {
			if (namiCS.dbug) console.log ("Got savedstuff from -temp.");
			savedObj = savedObj["nami-temp"];
			if (namiCS.dbug) {
				console.log ("Something (saved information) there.");
				console.log ("typeof(savedObj): " + typeof(savedObj) + ".");
				console.log ("savedObj: " + savedObj + ".");
				for (var k in savedObj) {
					console.log (k + ": " + savedObj[k] +".");
				}
			}
			namiCS.usingTmp = true;
			nami.getSavedFromJSON(savedObj);
			namiCS.startup();
		}

	}, nami.errorFun);
}, false);

browser.runtime.onMessage.addListener(namiCS.notify);

if (namiCS.dbug) console.log ("namiCS.js loaded.");

nami.addToPostLoad([function () {
	if (namiCS.dbug === false && nami.dbug === true) console.log ("turning namiCS.dbug on.");
	namiCS.dbug = nami.dbug;
}]);
