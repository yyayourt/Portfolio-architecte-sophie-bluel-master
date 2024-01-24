const form = document.getElementsByClassName("formLogin")[0].elements;
const loginUrl = "http://localhost:5678/api/users/login";

form["btnLogin"].addEventListener("click", function (event) {
    event.preventDefault();

    fetch(loginUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({
            email: form.email.value,
            password: form.password.value,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem("auth", JSON.stringify(data));
            const auth = JSON.parse(localStorage.getItem("auth"));
            if (auth && auth.token) {
                window.location = "index.html";
            } else {
                console.log("error");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});
