document.addEventListener('DOMContentLoaded', function () {
	let popupOverlay = document.querySelector('.popup-overlay');
	let popupContent = document.querySelector('.popup-content');
	let triggerImages = document.querySelectorAll('.trigger-image');
	let otherElements = document.querySelectorAll(':not(.popup-overlay)');

	popupOverlay.style.visibility = 'hidden';

	triggerImages.forEach(function (image) {
		image.addEventListener('click', function (event) {
			// Make sure popup doesnt close instantly when opened
			event.stopPropagation();

			popupOverlay.style.visibility = 'visible';
			popupOverlay.addEventListener('click', closePopupOutside);

			// Set the z-index of other elements to 0
			otherElements.forEach(function (element) {
				element.style.zIndex = 0;
			});

			// Disable scrolling
			document.body.style.overflow = 'hidden';

			// Change id to "popup-open" when the popup is opened
			popupContent.id = 'popup-content-open';
			popupOverlay.id = 'popup-overlay-open';
		});
	});

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
		}
	}

	// Set the html of the popup, when clicked

	// Get the buttons and popup content
	const button_list = document.getElementsByClassName('grid-item');
	const popup_content = document.getElementById('popup-content-closed');

	// Get the html code into a dictionary
	const dictionary = {};
	fetch('./popup_html.txt')
		.then(response => response.text())
		.then(data => {
			projectList = data.split('\r\n\r\n');
			for (let i = 0; i < projectList.length; i++) {
				let lines = projectList[i].split('\r\n');
				let name = lines[0];
				let html = lines.slice(1).join('\r\n');
				console.log(name);
				console.log(html);
				dictionary[name] = html;
			}
			console.log(projectList);
		})
		.catch(error => {
			console.log('Error:', error);
		});

	// Add event listeners to all buttons, to change the popup content when clicked
	for (let i = 0; i < button_list.length; i++) {
		button_list[i].addEventListener('click', function () {
			// Name of button is the id of the button
			let name = button_list[i].id;
			popup_content.innerHTML = dictionary[name];
		});
	}
});