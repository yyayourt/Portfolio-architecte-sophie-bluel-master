const openModalBtn = document.getElementById("openModalBtn");
const modal = document.getElementById("myModal");
const modalContent = document.getElementById("modalContent");
const modalPhoto = document.getElementById("modalPhoto");

const btnRetour = document.getElementById("btnRetour");
const previewImage = document.getElementById("previewImage");
const labelPhoto = document.getElementById("btnImage");

const span = document.querySelector(".inputPhoto span");
const iconeImg = document.querySelector(".inputPhoto i");
const btnClose = document.getElementById("btnClose");

const addProjectForm = document.getElementById("formulaireAjoutPhoto");
const uploadImageInput = document.getElementById("fileInput");
const submitProjet = document.getElementById("btnValider");
const projectUpload = document.getElementById("previewImage");

uploadImageInput.style.display = "none";

//bouton pour ouvrir la modal
openModalBtn.addEventListener("click", (event) => {
    event.preventDefault();
    modal.style.display = "block";
    genererProjets();
});

//modal inexistante tant que l'utilisateur est deconnecter
if (!isConnected()) {
    openModalBtn.style.display = "none";
}

//bouton pour revenir sur la modal content
btnRetour.addEventListener("click", (event) => {
    event.preventDefault();
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
btnClose.addEventListener("click", (event) => {
    event.preventDefault();
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
            // .then((response) => response.json()) // Pas besoin de récupérer la réponse car 204 No Content
            .then(() => {
                console.log("Projet supprimé avec succès");
                // (Optionnel) Fermer la modale
                // Mettre à jour les projets dans le localStorage (ou faire un appel à getWorks())
                genererProjets();
                getWorks();
                modal.style.display = "none";
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
ajouterPhotoButton.addEventListener("click", (event) => {
    event.preventDefault();
    modalPhoto.style.display = "flex";
    modalContent.style.display = "none";
});

// Fonction pour afficher l'aperçu de l'image
function attachChangeEvent() {
    uploadImageInput.addEventListener("change", function (event) {
        // Appel de la fonction pour afficher l'aperçu de l'image
        uploadImage();

        //code pour masquer les éléments de l'interface et afficher l'aperçu de l'image
        const file = event.target.files[0];
        if (file) {
            iconeImg.style.display = "none";
            labelPhoto.style.display = "none";
            uploadImageInput.style.display = "none";
            span.style.display = "none";
            previewImage.src = URL.createObjectURL(file);
            previewImage.style.display = "block";
        }
    });
}

function resetModal() {
    // Remettre à zéro tous les éléments de la modal
    iconeImg.style.display = "flex";
    labelPhoto.style.display = "flex";
    span.style.display = "flex";
    previewImage.style.display = "none";
    uploadImageInput.value = ""; // Réinitialiser l'input de l'image
}

// Fonction pour afficher l'aperçu de l'image
function uploadImage() {
    if (uploadImageInput.files && uploadImageInput.files[0]) {
        const reader = new FileReader();
        const image = new Image();

        submitProjet.style.backgroundColor = "#1D6154";
        projectUpload.style.display = "block";
        reader.readAsDataURL(uploadImageInput.files[0]);
        projectUpload.appendChild(image);
    }
}

// Attacher l'événement 'change' initialement
attachChangeEvent();

// Fonction pour gérer l'envoi du formulaire
async function handleFormSubmit(event) {
    event.preventDefault();

    // Vérifier que tous les champs obligatoires sont remplis
    if (!addProjectForm.checkValidity()) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    // Récupérer les valeurs du formulaire
    const titleInput = document.getElementById("titreInput");
    const title = titleInput.value;
    const category = document.getElementById("categorieSelect").value;
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    // Créer un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    const postWorkUrl = "http://localhost:5678/api/works";
    const token = recuperationToken();
    fetch(postWorkUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    })
        .then((response) => response.json())
        .then(() => {
            // Vider la zone de texte du titre
            titleInput.value = "";

            resetModal();

            // Attacher l'événement 'change' à nouveau
            attachChangeEvent();

            // Mettre à jour les projets dans le localStorage (ou faire un appel à getWorks());
            // Générer les projets dans la modale et dans la page principale.
            genererProjets();
            getWorks();
            modal.style.display = "none";
        });
}

addProjectForm.addEventListener("submit", handleFormSubmit);
