document.addEventListener('DOMContentLoaded', function () {
	let popupOverlay = document.querySelector('.popup-overlay');
	let popupContent = document.querySelector('.popup-content');
	let gridItems = document.querySelectorAll('.grid-item');
	let otherElements = document.querySelectorAll(':not(.popup-overlay)');

	popupOverlay.style.visibility = 'hidden';

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
	
	// Add event listeners to all buttons, to open and change html of the popup when clicked
	for (let i = 0; i < gridItems.length; i++) {
		gridItems[i].addEventListener('click', function () {
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
			let name = gridItems[i].id;
			popupContent.innerHTML = dictionary[name];
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

	// Set the html of the popup, when clicked

	// Get the buttons and popup content
	// const button_list = document.getElementsByClassName('grid-item');
	// const popup_content = document.getElementById('popup-content-closed');

	// // Get the html code into a dictionary
	// const dictionary = {};
	// fetch('./popup_html.txt')
	// 	.then(response => response.text())
	// 	.then(data => {
	// 		projectList = data.split('\r\n\r\n');
	// 		for (let i = 0; i < projectList.length; i++) {
	// 			let lines = projectList[i].split('\r\n');
	// 			let name = lines[0];
	// 			let html = lines.slice(1).join('\r\n');
	// 			console.log(name);
	// 			console.log(html);
	// 			dictionary[name] = html;
	// 		}
	// 		console.log(projectList);
	// 	})
	// 	.catch(error => {
	// 		console.log('Error:', error);
	// 	});

	// // Add event listeners to all buttons, to change the popup content when clicked
	// for (let i = 0; i < button_list.length; i++) {
	// 	button_list[i].addEventListener('click', function () {
	// 		// Name of button is the id of the button
	// 		let name = button_list[i].id;
	// 		popup_content.innerHTML = dictionary[name];
	// 		const image_div = document.getElementById('popup-image-div');
	// 		image_div.style.height = '100%';
	// 	});
	// }
});