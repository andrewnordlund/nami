if (typeof (namiCS) == "undefined") {
	var namiCS = {};
}

var namiCS = {
	dbug : nami.dbug,
	usingTmp : false,
	init : function () {
	}, // End of init
	
	run : function () {
		if (namiCS.dbug) console.log ("namiCS::running....");
	}, // End of startup
	notify : function (message) {
		if (namiCS.dbug) console.log ("namiCS::Got a message: " + message["msg"] + ", task: " + message["task"] + "."); // from " + message["pageURL"]);
		/*
		   Don't do this.  It defeats the purpose of XRay Vision.  It messes with the page itself.  If you want to be better than WAVE don't act like WAVE.
		   However, I'll leave this here in case Chrome forces my hand.
		let head = null;
		head = document.getElementsByTagName("head");
		if (head) {
			if (namiCS.dbug) console.log ("Got head.");
			head = head[0];
			let namiBML = document.createElement("script");
			namiBML.setAttribute("id", "namiBML");
			namiBML.setAttribute("src", "moz-extension://aedc443d-896c-4eef-b7d8-ae360fb122a5/content_scripts/namiBML.js");
			head.appendChild(namiBML);
		} else {
			if (namiCS.dbug) console.log ("Didn't get head.");
		}
		*/
		 
		   // deal with tasks here
		
		if (message["task"] == "run") {
			if (namiCS.dbug) console.log ("namiCS::running....");
			namiBML.run();
			/*
			let isthere = null;
			isthere = document.querySelector(".nordburg-nami");
			if (isthere) {
				if (namiCS.dbug) console.log ("namiCS::resetting....");
				namiBML.reset();
			} else {
				if (namiCS.dbug) console.log ("namiCS::running....");
				namiBML.run();
			}
			*/
		}
		
		
	}, // End of notify
} // End of namiCS
/*
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
*/
browser.runtime.onMessage.addListener(namiCS.notify);

nami.addToPostLoad([function () {
	if (namiCS.dbug === false && nami.dbug === true) console.log ("turning namiCS.dbug on.");
	namiCS.dbug = nami.dbug;
}]);
if (namiCS.dbug) console.log ("namiCS.js loaded.  Now gonna run.");
namiCS.run();
