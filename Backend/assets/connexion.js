const logout = document.querySelector('[href="login.html"]');
let filtres = null;

function recuperationToken() {
    const authData = JSON.parse(localStorage.getItem("auth"));
    if (authData && authData.token) {
        return authData.token;
    } else {
        return null;
    }
}

function isConnected() {
    const connected = recuperationToken() ? true : false;
    return connected;
}

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
