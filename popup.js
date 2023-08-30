document.addEventListener('projectGridReady', function () {
	let popupOverlay = document.querySelector('.popup-overlay');
	let popupContent = document.querySelector('.popup-content');
	let projectItems = document.querySelectorAll('.project-item');
	let otherElements = document.querySelectorAll(':not(.popup-overlay)');

	popupOverlay.style.visibility = 'hidden';
	
	// Add event listeners to all buttons, to open and change html of the popup when clicked
	for (let i = 0; i < projectItems.length; i++) {
		projectItems[i].addEventListener('click', function (event) {
			// Make sure popup doesnt close instantly when opened
			event.stopPropagation();

			popupOverlay.style.visibility = 'visible';
			popupOverlay.addEventListener('click', closePopupOutside);

			// Set the z-index of other elements to 0
			otherElements.forEach(function (element) {
				element.style.zIndex = 0;
			});

			// Disable scrolling
			// document.body.style.overflow = 'hidden';

			// Reset scroll position of popup when opened
			popupContent.scrollTop = 0;

			// Change id to "popup-open" when the popup is opened
			popupContent.id = 'popup-content-open';
			popupOverlay.id = 'popup-overlay-open';

			// Change the html of the popup
			const name = projectItems[i].id;
			const HTML = `
			<div id="popup-image-div-closed">
				<img src="${imageDict[name]}" alt="Popup Image" class="popup-image">
			<h2 class="centered-on-image">${name}</h2>
			</div>
			<p id="popup-text">
				<span class="date-text">${dateDict[name]}</span><br>
				<a href="${projectLinkDict[name]}" target="_blank" class="icon popup-icon"><img src="${iconDict[name]}"></a>
				${textDict[name]}
			</p>`;
			popupContent.innerHTML = HTML;
			const imageDiv = document.getElementById('popup-image-div-closed');
			waitForNextFrame(function() {
				imageDiv.id = 'popup-image-div-open';
			});
			// imageDiv.style.height = '100%';
		});
	};

	// Close the popup when clicked outside
	function closePopupOutside(event) {
		if (event.target === popupOverlay && !popupContent.contains(event.target)) {
			// popupOverlay.style.display = 'none';
			popupOverlay.removeEventListener('click', closePopupOutside);

			// Reset the z-index of other elements
			otherElements.forEach(function (element) {
				element.style.zIndex = '';
			});

			// Enable scrolling
			document.body.style.overflow = '';

			// Change id to "popup-closed" when the popup is closed
			popupContent.id = 'popup-content-closed';
			popupOverlay.id = 'popup-overlay-closed';

			setTimeout(function () {
				popupOverlay.style.visibility = 'hidden';
			}, 400);

			const imageDiv = document.getElementById('popup-image-div-open');
			imageDiv.id = 'popup-image-div-closed';
		}
	}

	function waitForNextFrame(callback) {
		requestAnimationFrame(function() {
			requestAnimationFrame(callback);
		});
	}
});