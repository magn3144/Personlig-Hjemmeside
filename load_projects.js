let categoryDict = {};
let dateDict = {};
let textDict = {};
let imageDict = {};
let iconDict = {};
let projectLinkDict = {};

document.addEventListener('DOMContentLoaded', function() {
    // Get the html code into a dictionary
    fetch('ProjectsHTML.csv')
        .then(response => response.text())
        .then(csvData => {
            const csvRows = csvData.split('\n');
            csvRows.shift();

            csvRows.forEach(row => {
                const [name, category, date, text, imageSrc, icon, projectLink] = row.split(';');
                categoryDict[name] = category;
                dateDict[name] = date;
                textDict[name] = text;
                imageDict[name] = 'images/' + imageSrc;
                iconDict[name] = 'images/' + icon + '.png';
                projectLinkDict[name] = projectLink;
            });

            let nextScript = new Event('HTMLDictsReady');
            document.dispatchEvent(nextScript);
        })
        .catch(error => {
            console.log('Error:', error);
        });
});