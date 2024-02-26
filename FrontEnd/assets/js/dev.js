getWorks();
getCate();

// Fonction pour récupérer les œuvres depuis l'API
function getWorks() {
    const urlWorks = "http://localhost:5678/api/works";

    // Effectue une requête GET pour récupérer les œuvres
    fetch(urlWorks)
        .then((res) => res.json())
        .then((data) => {
            localStorage.setItem("worksedit", JSON.stringify(data));
            genererReponse(data);
        });
}

// Fonction pour générer les projets
function genererReponse(works) {
    const gallery = document.getElementsByClassName("gallery")[0];

    gallery.innerHTML = "";

    const fragment = document.createDocumentFragment();

    // Parcours les œuvres et génère les éléments correspondants dans la galerie
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

// Fonction pour récupérer les catégories depuis l'API
function getCate() {
    const urlCat = "http://localhost:5678/api/categories";

    fetch(urlCat)
        .then((res) => res.json())
        .then((data) => {
            localStorage.setItem("categories", JSON.stringify(data));
            filtre(data);
        });
}

// Fonction pour filtrer les projets en fonction de la catégorie sélectionnée
function filtre(categories) {
    const buttonsContainer = document.getElementById("buttonsContainer");
    buttonsContainer.innerHTML = "";

    // Ajoute un bouton "Tous" pour afficher tous les projets
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", function () {
        afficherProjets(null);
        removeAllActiveClasses();
    });
    buttonsContainer.appendChild(allButton);

    // Parcours les catégories et crée des boutons correspondants pour filtrer les projets
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

// Fonction pour supprimer toutes les classes "active" des boutons de catégorie
function removeAllActiveClasses() {
    const buttons = document.querySelectorAll("#buttonsContainer button");
    buttons.forEach((button) => {
        button.classList.remove("active");
    });
}

// Fonction pour afficher les projets en fonction de la catégorie sélectionnée
function afficherProjets(categorieId) {
    const works = JSON.parse(localStorage.getItem("worksedit"));
    let projectsToShow = works;

    // Filtrer les projets en fonction de l'ID de la catégorie sélectionnée
    if (categorieId) {
        projectsToShow = works.filter((work) => work.categoryId === categorieId);
    }

    // Génère la réponse (affiche les projets filtrés)
    genererReponse(projectsToShow);
}
