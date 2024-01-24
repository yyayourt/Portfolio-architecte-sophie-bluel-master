getWorks();
getCate();

function getWorks() {
    const urlWorks = "http://localhost:5678/api/works";

    fetch(urlWorks)
        .then((res) => res.json())
        .then((data) => {
            localStorage.setItem("worksedit", JSON.stringify(data));
            genererReponse(data);
        });
}

function genererReponse(works) {
    const gallery = document.getElementsByClassName("gallery")[0];

    gallery.innerHTML = "";

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < works.length; i++) {
        const article = works[i];
        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");

        imageElement.src = article.imageUrl;

        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = article.title;

        fragment.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(figcaptionElement);
    }

    gallery.appendChild(fragment);
}

function getCate() {
    const urlCat = "http://localhost:5678/api/categories";

    fetch(urlCat)
        .then((res) => res.json())
        .then((data) => {
            localStorage.setItem("categories", JSON.stringify(data));
            filtre(data);
        });
}

function filtre(categories) {
    const buttonsContainer = document.getElementById("buttonsContainer");
    buttonsContainer.innerHTML = "";

    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", function () {
        afficherProjets(null);
        removeAllActiveClasses();
    });
    buttonsContainer.appendChild(allButton);

    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const button = document.createElement("button");

        button.textContent = category.name;
        button.addEventListener("click", function () {
            afficherProjets(category.id);
            removeAllActiveClasses();
            button.classList.add("active");
        });

        buttonsContainer.appendChild(button);
    }
}
function removeAllActiveClasses() {
    const buttons = document.querySelectorAll("#buttonsContainer button");
    buttons.forEach((button) => {
        button.classList.remove("active");
    });
}

function afficherProjets(categorieId) {
    const works = JSON.parse(localStorage.getItem("worksedit"));
    let projectsToShow = works;

    if (categorieId) {
        projectsToShow = works.filter(
            (work) => work.categoryId === categorieId
        );
    }

    genererReponse(projectsToShow);
}
