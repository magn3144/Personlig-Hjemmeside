// Fetch the CSV file
fetch('DTU_Grades.csv')
    .then(response => response.text())
    .then(csvData => {
        const courseGrid = document.getElementById('course-grid');
        const csvRows = csvData.split('\n');
        csvRows.shift();

        // Loop through each CSV row and add to the HTML structure
        csvRows.forEach(row => {
            const [name, grade, ects, semester, course_id] = row.split(';');

            const courseRow = document.createElement('div');
            courseRow.classList.add('course-row', 'hover-shadow');

            const nameElement = document.createElement('p');
            nameElement.classList.add('course-item', 'name');
            nameElement.textContent = name;

            const gradeElement = document.createElement('p');
            gradeElement.classList.add('course-item', 'grade');
            gradeElement.textContent = grade;

            const ectsElement = document.createElement('p');
            ectsElement.classList.add('course-item', 'ects');
            ectsElement.textContent = ects;

            const semesterElement = document.createElement('p');
            semesterElement.classList.add('course-item', 'semester');
            semesterElement.textContent = semester;
            
            courseRow.appendChild(nameElement);
            courseRow.appendChild(gradeElement);
            courseRow.appendChild(ectsElement);
            courseRow.appendChild(semesterElement);

            courseRow.addEventListener('click', () => {
                window.open(`https://kurser.dtu.dk/course/${course_id}`);
            });

            courseGrid.appendChild(courseRow);
        });
    })
    .catch(error => {
        console.error('Error loading CSV file:', error);
    });