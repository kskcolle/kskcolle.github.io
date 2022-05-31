(function() {
	
	var style = "-webkit-writing-mode: vertical-lr;" +
				" writing-mode: tb-lr;" +
				" writing-mode: vertical-lr;" +
				" margin-bottom: 5px;";
	
	var needToFix = [
		{
			hrefLocRegex: new RegExp('^' + escapeRegex(window.location.href + 'megaschaak_bestanden') + '.*$','i'),
			nameRegex: /^frSheet$/i,
		},
	];
	

	function escapeRegex(s) {
		return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}
	
	document.addEventListener('DOMContentLoaded', function(ev) {
		for(var i = 0, l = window.frames.length; i < l; i++) {
			addFrameListeners(window.frames[i]);
		}
	});
	
	function addFrameListeners(w) {
		w.frameElement.addEventListener('load', function(ev){
			frameWindowLoaded(this.contentWindow);
		});
	}
	
	function frameWindowLoaded(win) {
		for(var i = 0, l = win.frames.length; i < l; i++) {
			var f = win.frames[i];
			// already loaded so won't trigger load event again
			if(f.document.readyState === "complete") {
				frameWindowLoaded(f);
			}
			addFrameListeners(f);
		}
		fixTable(win);
	}
	
	function fixTable(w) {
		var doc = w.document;
		fixTableWidth(doc);

		if(checkFixTableConditions(w)) {	
			var tds = doc.querySelectorAll('body>table>tbody>tr:first-child>td, body>table>tr:first-child>td');
			for(var i = 0, l = tds.length; i < l; i++) {
				var td = tds[i];
				// td contains only text
				if(td.childNodes.length == 1 && td.childNodes[0].nodeType == Node.TEXT_NODE) {
					var span = doc.createElement('span');
					
					// set the styling for the span
					span.setAttribute('style', style);
					
					// remove text from td and add to span
					span.appendChild(td.removeChild(td.childNodes[0]));
					td.appendChild(span);
				}
			}
		}
	}

	function fixTableWidth(doc) {
		var tables = doc.querySelectorAll('body[class^="xl"]>table');
		for(var i = 0, l=tables.length; i < l; i++) {
			tables[i].style.width = 'auto';
		}
	}
	
	//check if frame matches one of the defined conditions
	function checkFixTableConditions (w) {
		for(var i = 0, l = needToFix.length; i < l; i++) {
			var fixCondition = needToFix[i];
			// per condition all defined properties must match!
			
			if(fixCondition.hasOwnProperty('hrefLocRegex') && ! fixCondition.hrefLocRegex.test(w.location.href)) {
				continue; // did not match condition so go to the next in the loop
			}
			if(fixCondition.hasOwnProperty('nameRegex') && ! fixCondition.nameRegex.test(w.name)) {
				continue;
			}
			
			return true;
		}
		return false;
	}

})();