if (typeof (nami) == "undefined") {
	var nami = {};
}
var nami = {
	dbug : !false,
	loaded : false,
	postLoad : [],
	options : {
		"dbug": nami.dbug
	},
	init : function () {

	}, // End of init
	save : function (callback) {
		//var saving = browser.storage.local.set({"nami": nami./*something*/});
		if (nami.dbug) console.log ("Saved.  Gonna handle promises now.  Callback: "  + callback + ", typeof callback: " + typeof(callback) + ".");
		if (callback) saving.then(callback, nami.errorFun);
	}, // End of save
	getSaved : function (success, failure) {
		var getting = browser.storage.local.get("nami");
		getting.then(function (savedObj) {
			if (nami.dbug) console.log ("Got stored stuff.");
			if (nami.countObjs(savedObj) == 0) {
				var msgCentre = null;
				msgCentre = document.getElementById("msgCentre");
				if (msgCentre) {
					nami.createHTMLElement(document, "p", {"parentNode":msgCentre, "textNode" : "Sorry. It appears you have nothing saved."});
				}
			} else {
				if (nami.dbug) console.log ("Got savedstuff.");
				savedObj = savedObj["nami"];
				if (nami.dbug) {
					console.log ("Something (saved information) there.");
					console.log ("typeof(savedObj): " + typeof(savedObj) + ".");
					console.log ("savedObj: " + typeof(savedObj["lastRead"]) + ".");
					for (var k in savedObj["lastRead"]) {
						console.log (k + ": " + savedObj["lastRead"][k] +".");
					}
				}
				nami.getSavedFromJSON(savedObj);
			}
			if (success) success();
		}, failure);
	}, // End of getSaved
	getSavedFromJSON : function (savedObj) {
		var callback = null;
		if (arguments.length > 1 ) callback = arguments[1];

		/* Something * / = savedObj;*/
		
		if (callback && typeof callback != "undefined") callback();
	}, // End of getSavedFromJSON
	loadOptions : function (success, failure) {
		if (nami.dbug) console.log ("Loading Options.");
		var theThen = function (savedObj) {
			if (nami.dbug) console.log ("Got stored options.");
			if (nami.countObjs(savedObj) == 0) {
				if (nami.dbug) console.log ("There ain't no options there.  This is normal if it's your first time running this.");
			} else {
				if (nami.dbug) console.log ("Got saved options.");
				if (savedObj.hasOwnProperty("namiOptions")) savedObj = savedObj["namiOptions"];
				if (nami.dbug) {
					console.log ("Something (options) there.");
					console.log ("typeof(savedObj): " + typeof(savedObj) + ".");
					console.log ("savedObj: " + nami.objToString(savedObj) + ".");
				}
				for (var opt in nami.options) {
					if (savedObj.hasOwnProperty(opt)) {
						nami.options[opt] = savedObj[opt];
						if (opt == "dbug") {
							if (nami.dbug === false && nami.options[opt] === true) console.log ("loadOptions::Turning nami.dbug on.");
							nami.dbug = nami.options[opt];
						} else if (opt == "syncFormURL") {
							nordburg.syncFormURL = nami.options[opt];
						}
					}
				}
			}
			nami.setLoaded();
			if (success) success();
		}
		try {
			var getting = browser.storage.local.get("namiOptions");
			if (nami.dbug) console.log ("Loaded Options. Gonna deal with promises.");
			getting.then(theThen, failure);
		}
		catch(ex) {
			console.log ("Caught something! " + ex.toString());
		}

	}, // End of loadOptions
	setLoaded : function () {
		nami.loaded = true;
		nami.afterLoad();
	}, // End of setLoaded
	afterLoad : function () {
		for (var i = 0; i < nami.postLoad.length; i++) {
			nami.postLoad[i]();
		}
	}, // End of afterLoad
	addToPostLoad : function (funcs) {
		nami.postLoad = Object.assign(nami.postLoad, funcs);
		if (nami.loaded) {
			nami.afterLoad();
		}
	}, // End of addToPostLoad
	errorFun : function (e) {
		console.error ("Error! " + e);
	}, // End of errorFun
	createHTMLElement : function (creator, type, attribs) {
			// Taken from nordburg.js 4.0.22
		if (nami.dbug) console.log("nami::createHTMLElement " + type + (attribs.hasOwnProperty("id") ? "#" + attribs["id"] : "") + (attribs.hasOwnProperty("textNode") ? " containing " + attribs["textNode"] : "") + ".");
		// From: http://stackoverflow.com/questions/26248599/instanceof-htmlelement-in-iframe-is-not-element-or-object
		var iwin = window;
		// idiv instanceof iwin.HTMLElement; // true
		var newEl = creator.createElement(type);
		for (var k in attribs) {
			if (nami.dbug) console.log ("Checking attrib " + k + ".");
			if (k == "parentNode") {
				if (nami.dbug) console.log("createHTMLElement::Dealing with parentnode.");
				var parentNode = nami.getHTMLElement(creator, attribs[k], dbug);
				try {
					if (attribs.hasOwnProperty("insertBefore")) {
						var beforeEl = nami.getHTMLElement(creator, attribs["insertBefore"], dbug);
						parentNode.insertBefore(newEl, beforeEl);
					} else if (attribs.hasOwnProperty("insertAfter")) {
						var afterEl = nami.getHTMLElement(creator, attribs["insertAfter"], dbug);
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
				} else if (attribs[k] instanceof iwin.HTMLElement || attribs[k] instanceof HTMLElement) {
					newEl.appendChild(attribs[k]);
				} else {
					newEl.appendChild(creator.createTextNode(attribs[k].toString()));
				}
			} else if (k.match(/^insert(Before|After)$/)) {
				// Do nothing.
			} else {
				newEl.setAttribute(k, attribs[k]);
			}
		}
		return newEl;
	}, // End of createHTMLElement
	objToString : function (obj) {
		var sep = (arguments.length == 2 &&arguments[1] != null ? arguments[1] : ", ");
		var returnValue = [];
		for (var k in obj) {
			returnValue.push(k + ": " + obj[k]);
		}
		return returnValue.join(sep);
	}, // End of objToString
	countObjs : function (obj) {
		var returnValue = 0;
		for (var i in obj) {
			returnValue++;
		}
		return returnValue;
	}, // End of countObjs
	getHTMLElement : function (creator, el) {
		var rv = null;
		var dbug = (((arguments.length == 3 && arguments[2] != null && arguments[2] != undefined && arguments[2] !== false) || nordburg.dbug == true) ? true : false); 
		var iwin = window;
		if (el instanceof HTMLElement || el instanceof iwin.HTMLElement) {
			rv = el;
		} else if (el instanceof String || typeof(el) === "string") {
			try {
				if (dbug) console.log ("Trying to getHTMLElement " + el + "");
				rv = creator.getElementById(el);
			} catch (er) {
				console.error("Error getting HTML Element #" + el + ".  Apparently that's not on this page.");
			}
		}
		return rv;
	}, // End of getHTMLElement
	createOptionsHTMLElement : function (creator, type, attribs) {
				// Taken from nordburg.js 4.0.22
		//console.log ("createOptionsHTMLElement::dbug: " + dbug + " because arguments.length: " + arguments.length + ", and argument[3]: " + arguments[3] + ".");
		if (nami.dbug) console.log("nami::createOptionsHTMLElement " + type + (attribs.hasOwnProperty("id") ? "#" + attribs["id"] : "") + (attribs.hasOwnProperty("textNode") ? " containing " + attribs["textNode"] : "") + ".");
		if (nami.dbug) console.log("nami::createOptionsHTMLElement Creator is " + creator + ".");

		var newEl = creator.createElement(type);
		for (var k in attribs) {
			if (nami.dbug) console.log ("Checking attrib " + k + ".");
			if (k == "parentNode") { // && attribs[k] instanceof HTMLElement) {
				if (nami.dbug) console.log("Dealing with parentnode.");
				var parentNode = nami.getHTMLElement(creator, attribs[k], dbug);
				try {
					if (attribs.hasOwnProperty("insertBefore")) {
						var beforeEl = nami.getHTMLElement(creator, attribs["insertBefore"], dbug);
						parentNode.insertBefore(newEl, beforeEl);
					} else if (attribs.hasOwnProperty("insertAfter")) {
						var afterEl = nami.getHTMLElement(creator, attribs["insertAfter"], dbug);
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

if (nami.dbug) console.log ("lib::nami loaded.");
nami.loadOptions(nami.init, nami.errorFun);
