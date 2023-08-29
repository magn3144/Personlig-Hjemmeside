let html_dict = {};
let category_dict = {};
let date_dict = {};
let text_dict = {};
let image_dict = {};

document.addEventListener('DOMContentLoaded', function() {
    // Get the html code into a dictionary
    fetch('./popup_html.html')
        .then(response => response.text())
        .then(data => {
            console.log('HTML loaded');
            projectList = data.split('\r\n\r\n');
            for (let i = 0; i < projectList.length; i++) {
                console.log("1");
                const lines = projectList[i].split('\r\n');
                const category = lines[0];
                const html = lines.slice(1).join('\r\n');

                console.log("2");
                const tempElement = document.createElement('div');
                tempElement.innerHTML = html;

                const name = tempElement.querySelector('.centered-on-image').textContent;
                // console.log('Name:', name);

                const dateSpan = tempElement.querySelector('.date-text');
                const date = dateSpan.textContent;

                const textParagraph = tempElement.querySelector('#popup-text');
                const text = textParagraph.textContent.split(date)[1].trim();

                const image = tempElement.querySelector('.popup-image');
                const imageSrc = image.src;
                console.log("3");

                html_dict[name] = html;
                category_dict[name] = category;
                date_dict[name] = date;
                text_dict[name] = text;
                image_dict[name] = imageSrc;
                console.log("4");

                // console.log('Date:', date);
                // console.log('Text:', text);
                // console.log('Image:', imageSrc);
            }
            // console.log(projectList);

            let nextScript = new Event('HTMLDictsReady');
            document.dispatchEvent(nextScript);
            console.log('HTML dicts ready');
        })
        .catch(error => {
            console.log('Error:', error);
        });
});