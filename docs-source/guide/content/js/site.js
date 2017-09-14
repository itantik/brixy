(function() {
	document.getElementById('side-menu-title').onclick = function (e) {
		e.preventDefault();
		var smw = document.getElementById('side-menu-wrap');
		smw.className = smw.className == 'visible' ? '' : 'visible';
	};
})();