document.addEventListener('HTMLDictsReady', function() {
    const courseGrids = document.getElementsByClassName('projects-grid-container');
    // console.log(Object.keys(html_dict).length);
    // console.log(courseGrids);
    const names = Object.keys(html_dict);

    for (const name of names) {
        let courseGrid;
        for (let i = 0; i < courseGrids.length; i++) {
            if (courseGrids[i].id === category_dict[name]) {
                courseGrid = courseGrids[i];
                break;
            }
        }
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
        projectImage.src = image_dict[name];
        projectImage.alt = name;

        const projectTextContainer = document.createElement('div');
        projectTextContainer.classList.add('project-text-container');

        const projectItemLowerTitle = document.createElement('h2');
        projectItemLowerTitle.textContent = name;

        const dateText = document.createElement('span');
        dateText.classList.add('date-text');
        dateText.textContent = date_dict[name];

        const projectText = document.createElement('p');
        projectText.textContent = text_dict[name];

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