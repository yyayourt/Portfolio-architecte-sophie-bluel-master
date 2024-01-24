document.addEventListener("DOMContentLoaded", () => {
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

    const addProjectForm = document.querySelector("#formulaireAjoutPhoto");
    const uploadImageInput = document.querySelector("#fileInput");
    const submitProjet = document.querySelector("#btnValider");
    const projectUpload = document.querySelector("#previewImage");
    fileInput.style.display = "none";

    openModalBtn.addEventListener("click", () => {
        modal.style.display = "block";
        genererProjets();
    });

    if (!isConnected()) {
        openModalBtn.style.display = "none";
        modalPhoto.style.display = "none";
    }

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

    btnClose.addEventListener("click", () => {
        modal.style.display = "none";
    });

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

    function genererProjets() {
        const works = JSON.parse(localStorage.getItem("worksedit"));
        const title = document.createElement("h3");
        title.innerText = "Galerie photo";

        modalContent.innerHTML = "";
        modalContent.appendChild(title);

        const projectsContainer = document.createElement("div");
        projectsContainer.classList.add("projects-container");

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

    modalPhoto.style.display = "none";

    const ajouterPhotoButton = document.createElement("button");
    ajouterPhotoButton.classList.add("ajouterPhoto");
    ajouterPhotoButton.innerText = "Ajouter une photo";
    ajouterPhotoButton.addEventListener("click", () => {
        modalPhoto.style.display = "flex";
        modalContent.style.display = "none";

        const previewImage = document.getElementById("previewImage");
        const fileInput = document.getElementById("fileInput");

        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                previewImage.src = URL.createObjectURL(file);
                previewImage.style.display = "block";
            }
        });
    });
    const authToken =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4";
    // Fonctions pour ajouter des projets
    async function sendWorkData(data) {
        const postWorkUrl = "http://localhost:5678/api/works";

        const response = await fetch(postWorkUrl, {
            method: "POST",
            headers: {
                Authorization: authToken,
            },
            body: data,
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
            const response = await sendWorkData(formData, authToken);
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

    /*const token = recuperationToken();
        if (token) {
            fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }).then((response) => {
                response.json();
                console.log(response);
            });

            .then((data) => {
                    console.log("Photo ajoutée :", data);
                    afficherProjets();
                })
                .catch((error) => {
                    console.error(
                        "Erreur lors de l'ajout de la photo :",
                        error
                    );
                })
        }*/
});
