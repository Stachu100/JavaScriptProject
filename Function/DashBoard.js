document.addEventListener("DOMContentLoaded", function () {
    const links = [
        { name: 'Google', url: 'https://www.google.com' },
        { name: 'GitHub', url: 'https://www.github.com' }
    ];

    const linkList = document.getElementById("link-list");

    links.forEach(link => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = link.url;
        a.textContent = link.name;
        li.appendChild(a);
        linkList.appendChild(li);
    });
});