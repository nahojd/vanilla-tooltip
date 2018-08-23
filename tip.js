(function() {
	function Tip() {
		function isTip(element) {
			return element.classList.contains('tip');
		}

		function isInPopover(element) {
			if (!element || element.tagName.toLowerCase() === 'body')
				return false;

			if (element.classList.contains('popover-clone'))
				return true;

			return isInPopover(element.parentElement);
		}

		function hidePopovers() {
			const popovers = document.querySelectorAll('.popover-clone');
			for (let i = 0; i < popovers.length; i++) {
				document.body.removeChild(popovers[i]);
			}
			const links = document.querySelectorAll('.tip');
			for (let i = 0; i< links.length; i++) {
				links[i].dataOpenPopover = null;
			}
		}

		function toggleTooltip(target) {
			//Remove open popover if exists
			if (target.dataOpenPopover) {
				document.body.removeChild(target.dataOpenPopover);
				target.dataOpenPopover = null;
				return false;
			}

			//Or create and show popover
			const originalPopover = target.nextElementSibling;
			if (!originalPopover)
				return false;

			const popover = originalPopover.cloneNode(true);
			popover.classList.add('popover-clone');
			document.body.appendChild(popover);
			setPosition(popover, target);
			target.dataOpenPopover = popover;

			return false;
		}

		function setPosition(popover, target) {

			const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
			const scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
			const targetRect = target.getBoundingClientRect();
			const targetWidth = targetRect.width || targetRect.left - targetRect.right;
			const targetHeight = targetRect.height || targetRect.top - targetRect.bottom;

			//Position the popup window
			popover.style.display = 'block';
			popover.style.position = 'absolute';
			let left = targetWidth / 2 + targetRect.left + scrollX - popover.clientWidth / 2;
			if (left < 10) { left = 10; }
			popover.style.left = left + 'px';
			popover.style.bottom = document.documentElement.clientHeight - targetRect.top - scrollY + targetHeight/2 + 'px';
			popover.style.top = 'inherit';
			popover.style.right = 'inherit';
			popover.style.zIndex = 10000;

			//Position the arrow over the clicked element
			if (popover.querySelector) {
				const arrow = popover.querySelector('.arrow');
				arrow.style.left = targetRect.left - left + arrow.offsetWidth / 2 + 'px';
			}
		}

		function init() {
			document.body.addEventListener('click', function (e) {
				const target = e.target || e.srcElement;
				if (isTip(target) || isInPopover(target))
					return;

				hidePopovers();
			});

			window.addEventListener('resize', hidePopovers);
		}
		

		return {
			click: toggleTooltip,
			init: init
		};
	};

	window.vanillaTip = Tip();
})();
