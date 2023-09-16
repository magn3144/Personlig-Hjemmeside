function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
}

document.addEventListener('HTMLDictsReady', function() {
    const courseGrids = document.getElementsByClassName('projects-grid-container');
    const names = Object.keys(categoryDict);

    for (const name of names) {
        let courseGrid;
        for (let i = 0; i < courseGrids.length; i++) {
            if (courseGrids[i].id === categoryDict[name]) {
                courseGrid = courseGrids[i];
                break;
            }
        }

        // console.log(name);
        // console.log(categoryDict[name]);
        // console.log(dateDict[name]);
        // console.log(textDict[name]);
        // console.log(imageDict[name]);
        // console.log(iconDict[name]);
        // console.log(projectLinkDict[name]);
        // console.log(courseGrid);

        const projectItem = document.createElement('div');
        projectItem.classList.add('project-item');
        projectItem.id = name;

        const projectImageContainer = document.createElement('div');
        projectImageContainer.classList.add('project-image-container');

        const projectItemTitle = document.createElement('h2');
        projectItemTitle.classList.add('project-item-title');
        projectItemTitle.textContent = name;

        const projectImage = document.createElement('img');
        projectImage.src = imageDict[name];
        projectImage.alt = name;

        const projectTextContainer = document.createElement('div');
        projectTextContainer.classList.add('project-text-container');

        const projectItemLowerTitle = document.createElement('h2');
        projectItemLowerTitle.textContent = name;

        const dateText = document.createElement('span');
        dateText.classList.add('date-text');
        dateText.textContent = dateDict[name];

        const projectText = document.createElement('p');
        let text = textDict[name];
        projectText.textContent = truncateText(text, 100);

        projectImageContainer.appendChild(projectItemTitle);
        projectImageContainer.appendChild(projectImage);
        projectItem.appendChild(projectImageContainer);
        projectTextContainer.appendChild(projectItemLowerTitle);
        projectTextContainer.appendChild(dateText);
        projectTextContainer.appendChild(projectText);
        projectItem.appendChild(projectTextContainer);

        courseGrid.appendChild(projectItem);
    }

    let nextScript = new Event('projectGridReady');
    document.dispatchEvent(nextScript);
});