if (typeof (namiBML) == "undefined") {
	var namiBML = {};
}

namiBML = {
	dbug : true,
	run :  function () {
		// Look for autocomplete:
		namiBML.autocomplete();
	}, // End of run
	autocomplete :  function () {
		let forms, inputs, selects, textareas = null
		forms = document.getElementsByTagName("form");
		inputs = document.getElementsByTagName("input");
		selects = document.getElementsByTagName("select");
		textareas = document.getElementsByTagName("textarea");
		/*
		   	Gotta figure out how to add stuff.
			In NordFormsModeSimulator, it's really only checking text notes, which is mostly fine (except for <time> elements without datetime attributes).
			There, we know that we have a parent (like a <p>), so we create a span, and attach the text of the p to the span, and attach the span to the p.

			But we can't do that here, becuase we may be getting form elements, for example, which appear to be block level.  And they _can_ have children.  So we could just
			insert a first child with information.
			But we could also have an element that can't have children, like <input> or <br>.  Then what?  If we use a span...
			well...maybe we could just do a span.  Even if it autocloses, it'll come right before the element.  I wonder if that oculd screw things up, stylewise.
		   */

		 for (let i = 0; i < forms.length; i++) {
			if (namiCS.dbug) console.log ("Examing form " + i + "; display: " + getComputedStyle(forms[i]).getPropertyValue("display") + ".");
			let elDets = namiBML.createHTMLElement (document, "details", {"parentNode":forms[i].parentNode, "insertBefore":forms[i], "class":"nordburg-nami"});
			let elSum = namiBML.createHTMLElement (document, "summary", {"parentNode":elDets, "textNode" : "Form" + (forms[i].hasAttribute("autocomplete") ? " autocomplete=" + forms[i].getAttribute("autocomplete") : "")});
			let innards = namiBML.createHTMLElement (document, "dl", {"parentNode":elDets});
			let things = ["id", "autocomplete", "method", "action"];
			for (let j = 0; j < things.length; j++) {
				let newDT = namiBML.createHTMLElement(document, "dt", {"parentNode":innards, "textNode":things[j]});
				let newDD = namiBML.createHTMLElement(document, "dd", {"parentNode":innards, "textNode":(forms[i].hasAttribute(things[j]) ? forms[i].getAttribute(things[j]) : "N/A")});
			}
			if (forms[i].hasAttribute("autocomplete")) {
				if (namiCS.dbug) console.log ("autocomplete=" + forms[i].getAttribute("autocomplete") + ".");
			} else {
				if (namiCS.dbug) console.log ("No autocomplete.");
			}
		}
	}, // End of autocomplete


	/* Shamelessly stolen from nordburg.js.  But, hey!  nordburg.js is _my_ library!  I can do what I want! */
	createHTMLElement : function (creator, type, attribs) {
		var dbug = (((arguments.length == 4 &&arguments[3] != null && arguments[3] != undefined) || namiBML.dbug == true) ? true : false);
		if (dbug) console.log ("createHTMLElement::dbug: " + dbug + " because arguments.length: " + arguments.length + ", and argument[3]: " + arguments[3] + ".");
		if (dbug) console.log("namiBML::createHTMLElement " + type + (attribs.hasOwnProperty("id") ? "#" + attribs["id"] : "") + (attribs.hasOwnProperty("textNode") ? " containing " + attribs["textNode"] : "") + ".");
		// From: http://stackoverflow.com/questions/26248599/instanceof-htmlelement-in-iframe-is-not-element-or-object
		var iwin = window;
		// idiv instanceof iwin.HTMLElement; // true
		var newEl = creator.createElement(type);
		for (var k in attribs) {
			if (dbug) console.log ("Checking attrib " + k + ".");
			if (k == "parentNode") {
				if (dbug) console.log("createHTMLElement::Dealing with parentnode.");
				var parentNode = namiBML.getHTMLElement(creator, attribs[k], dbug);
				try {
					if (attribs.hasOwnProperty("insertBefore")) {
						var beforeEl = namiBML.getHTMLElement(creator, attribs["insertBefore"], dbug);
						parentNode.insertBefore(newEl, beforeEl);
					} else if (attribs.hasOwnProperty("insertAfter")) {
						var afterEl = namiBML.getHTMLElement(creator, attribs["insertAfter"], dbug);
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
	getHTMLElement : function (creator, el) {
		var rv = null;
		var dbug = (((arguments.length == 3 && arguments[2] != null && arguments[2] != undefined && arguments[2] !== false) || namiBML.dbug == true) ? true : false); 
		var iwin = window;
		if (el instanceof HTMLElement || el instanceof iwin.HTMLElement) {
			rv = el;
		} else if (el instanceof String || typeof(el) === "string") {
			try {
				if (dbug) console.log ("Trying to getHTMLElement " + el + ".");
				rv = creator.getElementById(el);
			} catch (er) {
				console.error("Error getting HTML Element #" + el + ".  Apparently that's not on this page.");
			}
		}
		return rv;
	}, // End of getHTMLElement
}
namiBML.run();

console.log ("namiBML loaded.");
