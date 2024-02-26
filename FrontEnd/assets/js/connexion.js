const logout = document.querySelector('[href="login.html"]');
let filtres = null;

//fonction pour recuperer le token depuis le stockage local
function recuperationToken() {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData && authData.token) {
        return authData.token;
    } else {
        return null;
    }
}

//fonction pour verifier si l'utilisateur est connecter
function isConnected() {
    const connected = recuperationToken() ? true : false;
    return connected;
}

//Si l'utilisateur est connecté, configure l'affichage du bouton de déconnexion et masque les autres éléments
if (isConnected()) {
    logout.textContent = "logout";
    logout.setAttribute("href", "#");
    const buttonsContainer = document.getElementById("buttonsContainer");
    const banner = document.getElementById("banner");
    buttonsContainer.style.display = "none";
    banner.style.display = "flex";

    logout.addEventListener("click", () => {
        localStorage.removeItem("auth");
        window.location.reload();
    });
}
