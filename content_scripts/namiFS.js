if (typeof (namiFS) == "undefined") {
	var namiFS = {};
}

namiFS = {
	run :  function () {
		// Look for autocomplete:
		namiFS.autocomplete();
	}, // End of run
	autocomplete :  function () {
		let forms, inputs, selects, textareas = null
		forms = document.getElementsByTagName("form");
		inputs = document.getElementsByTagName("input");
		selects = document.getElementsByTagName("select");
		textareas = document.getElementsByTagName("textarea");

		 for (let i = 0; i < forms.length; i++) {
			if (namiCS.dbug) console.log ("Examing form " + i + ".");
			if (forms[i].hasAttribute("autocomplete")) {
				if (namiCS.dbug) console.log ("autocomplete=" + forms[i].getAttribute("autocomplete") + ".");
			} else {
				if (namiCS.dbug) console.log ("No autocomplete.");
			}
		}
	}, // End of autocomplete
}
namiFS.run();

console.log ("namiFS loaded.");
