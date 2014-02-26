(function() {
	function Tip() {
		function isTip(element) {
			var classes = element.className.split(' ');
			for (var i = 0; i < classes.length; i++) {
				if (classes[i] === 'tip')
					return true;
			}
			return false;
		}

		function isInPopover(element) {
			if (!element || element.tagName.toLowerCase() === 'body')
				return false;

			var classes = element.className.split(' ');
			for (var i = 0; i < classes.length; i++) {
				if (classes[i] === 'popover-clone')
					return true;
			}
			return isInPopover(element.parentElement);
		}

		function hidePopovers() {
			var popovers = document.querySelectorAll('.popover-clone');
			for (var i = 0; i < popovers.length; i++) {
				document.body.removeChild(popovers[i]);
			}
		}

		function showTooltip(target) {
			var originalPopover = target.nextElementSibling || nextElementSibling(target);
			var popover = originalPopover.cloneNode(true);

			var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
			var scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;

			var targetRect = target.getBoundingClientRect();
			var targetWidth = targetRect.width || (targetRect.left - targetRect.right);

			document.body.appendChild(popover);
			popover.className = popover.className + ' popover-clone';

			//Position the popup window
			popover.style.display = 'block';
			popover.style.position = 'absolute';
			var left = (targetWidth / 2 + targetRect.left + scrollX - popover.clientWidth / 2);
			if (left < 10) {
				left = 10;
			}
			popover.style.left = left + 'px';
			popover.style.top = (targetRect.top + scrollY - popover.clientHeight - 5) + 'px';
			popover.className = popover.className + ' popover-clone';

			//Position the arrow over the clicked element
			if (popover.querySelector) {
				var arrow = popover.querySelector('.arrow');
				arrow.style.left = (targetRect.left - left + arrow.offsetWidth / 2) + 'px';
			}

			return false;
		}

		function nextElementSibling(el) {
			do {
				el = el.nextSibling;
			} while (el && el.nodeType !== 1);
			return el;
		}

		function addEventListener(element, name, callback) {
			if (element.addEventListener) {
				element.addEventListener(name, callback);
			} else if (element.attachEvent) { //IE8
				element.attachEvent('on' + name, callback);
			}
		}

		function init() {
			addEventListener(window, 'resize', hidePopovers);

			addEventListener(document, 'click', function(e) {
				var target = e.target || e.srcElement;
				if (isTip(target) || isInPopover(target))
					return;

				hidePopovers();
			});
		}
		

		return {
			click: showTooltip,
			init: init
		};
	};

	window.vanillaTip = Tip();
})();
