if (typeof (namiBG) == "undefined") {
	var namiBG = {};
}

var namiBG = {
	dbug : nami.dbug,
	init : function () {
		var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
		gettingActiveTab.then((tabs) => {
			if (tabs[0].url.match(/^https?:\/\//)) {
				if (namiBG.dbug) console.log ("namiBG::About to call the content script with task run.");
				browser.tabs.sendMessage(tabs[0].id, {"task": "run", "dbug": namiBG.dbug}).then( function () {
						if (namiBG.dbug) console.log ("namiBG::Sending message to namiCS worked!");
					}).catch(function (x) {		// NOTE:  In other add-ons I've writtenm it's }, thing.errorFun).catch.  But in this add-on, the errorFun gets executed, but the catch block doesn't.
						if (namiBG.dbug) console.log ("namiBG::Caught something: " + x.toString());
						if (x.toString() == "Error: Could not establish connection. Receiving end does not exist." || x.toString() == "TypeError: msg is undefined") {
							browser.tabs.insertCSS(tabs[0].id, {file : "/content_scripts/nami.css"}).then(function () {
								browser.tabs.executeScript(tabs[0].id, {file : "/libs/nami.js"}).then (function () {
									browser.tabs.executeScript(tabs[0].id, {file : "/content_scripts/nami-cs.js"}).then (function () {
										browser.tabs.executeScript(tabs[0].id, {file : "/content_scripts/nami-bml.js"}).then(function () {
											//browser.tabs.sendMessage(tabs[0].id, {"task": "run", "msg" : "Do work or cleanup", "dbug": namiBG.dbug}).then(function (msg) {
												if (namiBG.dbug) console.log ("Promise eventually fulfilled.");
											//}, nami.errorFun);
										}, nami.errorFun);
									}, nami.errorFun);
								}, nami.errorFun);
							}, nami.errorFun);
						}
					});	
				
			} else {
				if (namiBG.dbug) console.log ("Not a webpage.");
			}
		});
	}, // End of init
	notify : function (message, sender, sendResponse) {
		if (namiBG.dbug) console.log ("nami-bg::Got a message: " + (message.hasOwnProperty("msg") ? message["msg"] : "[no msg]") + " with task: " + message["task"] + " with sender " + sender + " and sendResponse " + sendResponse + ".");
		if (message["task"] == "someTask") {
			if (namiBG.dbug) console.log ("nami-bg::Gonna find a comic on " + message["pageURL"] + ".");
		} else if (message["task"] == "updateOptions") {
			nami.options = message["options"];
			namiBG.dbug = nami.options["dbug"];
			nami.dbug = nami.options["dbug"];
		} else if (message["task"] == "close") {
			// close the window
			var q = browser.tabs.query({title : "/* Some title */"});
			q.then(function (tabs) {
				if (namiBG.dbug) console.log ("nami-bg::tabs: " + tabs.length + ".");
				for (var t = 0; t < tabs.length; t++) {
					if (namiBG.dbug) console.log ("nami-bg::Closing " + tabs[t].url + ".");
					browser.tabs.remove(tabs[t].id);
				}
			}, nami.errorFun);
		} else {
			// Some default thing
		}
	} // End of notify
}

browser.browserAction.onClicked.addListener(namiBG.init);

browser.runtime.onMessage.addListener(namiBG.notify);
nami.addToPostLoad([function () {
	if (namiBG.dbug) console.log ("setting namiBG.dbug to " + nami.dbug + ".");
	namiBG.dbug = nami.dbug;}]
);
