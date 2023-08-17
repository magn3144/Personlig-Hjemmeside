// let s = "hey\n\nyo"

let projectList;

console.log("hello");

fetch('popup_html.txt')
    .then(response => response.text())
    .then(data => {
        projectList = data.split('\r\n\r\n');
        for (let i = 0; i < projectList.length; i++)
        {
            let lines = projectList[i].split('\r\n');
            let name = lines[0];
            let html = lines.slice(1).join('\r\n');
            console.log(name);
            console.log(html);
            
        }
        console.log(projectList);
    });

// for (let i = 0; i < stringList.length; i++)
// {
//     console.log(stringList[i]);
// }