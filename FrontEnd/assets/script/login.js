const alredyLoggedError = document.querySelector(".alredyLogged__error");
const loginEmailError = document.querySelector(".loginEmail__error");
const loginMdpError = document.querySelector(".loginMdp__error");

const email = document.getElementById("email");
const password = document.getElementById("password");

const predefinedUsername = "monutilisateur@gmail.com";
const predefinedPassword = "monmotdepasse";

const submit = document.getElementById("submit");

alredyLogged();

// Si l'utilisateur est déjà connecté, on supprime le token
function alredyLogged() {
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token");

        const p = document.createElement("p");
        p.innerHTML = "<br><br><br>Vous avez été déconnecté, veuillez vous reconnecter";
        alredyLoggedError.appendChild(p);
        return;
    }
}

// Au clic, on envoie les valeurs de connextion
submit.addEventListener("click", () => {
    let user = {
        email: email.value,
        password: password.value
    };
    login(user);
})

// Fonction de connexion
function login(id) {
    console.log(id);
    loginEmailError.innerHTML = "";
    loginMdpError.innerHTML = "";

    // Vérification de l'email
    if (!id.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/g)) {
        const p = document.createElement("p");
        p.innerHTML = "Veuillez entrer une adresse e-mail valide";
        loginEmailError.appendChild(p);
        return;
    }

    // Vérification du mot de passe
    if (id.email !== predefinedUsername || id.password !== predefinedPassword) {
        const p = document.createElement("p");
        p.innerHTML = "Nom d'utilisateur ou mot de passe incorrect";
        loginMdpError.appendChild(p);
        return;
    }

    // Si les identifiants sont corrects, redirigez l'utilisateur
    localStorage.setItem("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4");
    window.location.href = "index.html";


}


