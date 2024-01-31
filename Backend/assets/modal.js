const openModalBtn = document.getElementById("openModalBtn");
const modal = document.getElementById("myModal");
const modalContent = document.getElementById("modalContent");
const modalPhoto = document.getElementById("modalPhoto");

const btnRetour = document.getElementById("btnRetour");
const fileInput = document.getElementById("fileInput");
const previewImage = document.getElementById("previewImage");
const labelPhoto = document.getElementById("btnImage");

const span = document.querySelector(".inputPhoto span");
const iconeImg = document.querySelector(".inputPhoto i");
const btnClose = document.getElementById("btnClose");

const addProjectForm = document.getElementById("formulaireAjoutPhoto");
const uploadImageInput = document.getElementById("fileInput");
const submitProjet = document.getElementById("btnValider");
const projectUpload = document.getElementById("previewImage");

fileInput.style.display = "none";

//bouton pour ouvrir la modal
openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
    genererProjets();
});

//modal inexistante tant que l'utilisateur est deconnecter
if (!isConnected()) {
    openModalBtn.style.display = "none";
    modalPhoto.style.display = "none";
}

//bouton pour revenir sur la modal content
btnRetour.addEventListener("click", () => {
    modalPhoto.style.display = "none";
    modalContent.style.display = "flex";
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
        modalPhoto.style.display = "none";
        modalContent.style.display = "flex";
    }
});

//bouton croix pour fermer la modal
btnClose.addEventListener("click", () => {
    modal.style.display = "none";
});

//fonction pour generer la page modal(bouton close, titre, generer les projets)
function genererProjets() {
    const works = JSON.parse(localStorage.getItem("worksedit"));
    const title = document.createElement("h3");
    const closeBtn = document.createElement("button");
    closeBtn.classList.add("closeBtn");
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    title.innerText = "Galerie photo";
    modalContent.innerHTML = "";
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);

    //bouton close de la premiere modal
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    const projectsContainer = document.createElement("div");
    projectsContainer.classList.add("projects-container");

    //boucle pour generer les projets avec le bouton delete
    for (let i = 0; i < works.length; i++) {
        const project = works[i];
        const projectElement = document.createElement("figure");
        projectElement.classList.add("project");

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteButton.addEventListener("click", () => {
            supprimerProjet(project.id);
        });

        const imageElement = document.createElement("img");
        imageElement.src = project.imageUrl;

        projectElement.appendChild(deleteButton);
        projectElement.appendChild(imageElement);
        projectsContainer.appendChild(projectElement);
    }

    modalContent.appendChild(projectsContainer);
    modalContent.appendChild(ajouterPhotoButton);
}

// Fonction pour supprimer un projet
function supprimerProjet(id) {
    const token = recuperationToken();

    if (token) {
        fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Projet supprimé :", data);
                genererProjets();
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression :", error);
            });
    }
}

modalPhoto.style.display = "none";

//bouton pour ce diriger vers la modal d'ajout de photo
const ajouterPhotoButton = document.createElement("button");
ajouterPhotoButton.classList.add("ajouterPhoto");
ajouterPhotoButton.innerText = "Ajouter une photo";

// fonction pour afficher la modal photo a la place de la modal content
ajouterPhotoButton.addEventListener("click", () => {
    modalPhoto.style.display = "flex";
    modalContent.style.display = "none";
});

// Fonction pour afficher l'aperçu de l'image
function uploadImage() {
    if (uploadImageInput.files && uploadImageInput.files[0]) {
        const reader = new FileReader();
        const image = new Image();
        const fileName = uploadImageInput.files[0].name;

        reader.onload = (event) => {
            image.src = event.target.result;
            image.alt = fileName.split(".")[0];
        };

        submitProjet.style.backgroundColor = "#1D6154";
        projectUpload.style.display = "block";
        reader.readAsDataURL(uploadImageInput.files[0]);
        projectUpload.appendChild(image);
    }
}

//fonction pour supprimer l'affichage de tout les elements de inputPhoto pour afficher la photo
fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        iconeImg.style.display = "none";
        labelPhoto.style.display = "none";
        fileInput.style.display = "none";
        span.style.display = "none";
        previewImage.src = URL.createObjectURL(file);
        previewImage.style.display = "block";
    }
});

// Fonctions pour ajouter des projets
async function sendWorkData(data) {
    const postWorkUrl = "http://localhost:5678/api/works";
    const token = recuperationToken();
    const response = await fetch(postWorkUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return response.json();
}

// Fonction pour gérer l'envoi du formulaire
async function handleFormSubmit(event) {
    event.preventDefault();

    // Vérifier que tous les champs obligatoires sont remplis
    if (!addProjectForm.checkValidity()) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    // Récupérer les valeurs du formulaire

    const title = addProjectForm.querySelector("#titreInput").value;
    const category = addProjectForm.querySelector("#categorieSelect").value;
    const file = uploadImageInput.files[0];

    // Créer un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    // Envoyer les données et afficher la réponse
    try {
        const response = await sendWorkData(formData);
        console.log(response);

        const alert = document.getElementById("alert");
        alert.innerHTML = "Votre photo a été ajouté avec succès";
        alert.style.display = "block";
        setTimeout(function () {
            alert.style.display = "none";
        }, 5000);
    } catch (error) {
        console.error("Erreur :", error);
    }
}

// Ajout des événements pour gérer l'upload de photos
uploadImageInput.addEventListener("change", function () {
    uploadImage();
});

addProjectForm.addEventListener("submit", handleFormSubmit);
