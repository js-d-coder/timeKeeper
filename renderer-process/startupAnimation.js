// ------------ animate the loading of page content and navigation ------

window.addEventListener('load', function() {
				window.setTimeout(function() {
                    const body = document.querySelector('body');
					body.classList.add('show-body');
					window.setTimeout(function() {
	                    const nav = document.querySelector('nav');
						nav.classList.remove('nav-is-hidden');
					}, 100);
				}, 100);
});
