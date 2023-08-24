let html_dict = {};
let category_dict = {};
let date_dict = {};
let text_dict = {};

// Get the html code into a dictionary
fetch('./popup_html.txt')
    .then(response => response.text())
    .then(data => {
        projectList = data.split('\r\n\r\n');
        for (let i = 0; i < projectList.length; i++) {
            let lines = projectList[i].split('\r\n');
            let name = lines[0];
            let category = lines[1];
            let html = lines.slice(2).join('\r\n');
            // console.log(name);
            // console.log(category);
            // console.log(html);
            html_dict[name] = html;
            category_dict[name] = category;

            const tempElement = document.createElement('div');
            tempElement.innerHTML = html;

            const dateSpan = tempElement.querySelector('.date-text');
            const date = dateSpan.textContent;

            const textParagraph = tempElement.querySelector('#popup-text');
            const text = textParagraph.textContent.split(date)[1].trim();

            date_dict[name] = date;
            text_dict[name] = text;

            console.log('Date:', date);
            console.log('Text:', text);
        }
        console.log(projectList);

        let nextScript = new Event('HTMLDictsReady');
        document.dispatchEvent(nextScript);
    })
    .catch(error => {
        console.log('Error:', error);
    });