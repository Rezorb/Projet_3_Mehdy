const alreadyLoggedError = document.querySelector(".alreadyLogged__error"); 
const loginEmailError = document.querySelector(".loginEmail__error"); 
const loginMdpError = document.querySelector(".loginMdp__error"); 
const apiUrl = "http://localhost:5678/api/users/login";

const email = document.getElementById("email");
const password = document.getElementById("password");

const submit = document.getElementById("submit");

alreadyLogged();

// Suppression du token si l'utilisateur est déjà connecté.
function alreadyLogged() {
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
    }
}

// Au clic, les valeurs de connexion sont envoyées.
submit.addEventListener("click", () => {
    let user = {
        email: email.value,
        password: password.value
    };
    login(user);
})

// Fonction de connexion.
async function login(user) {
    console.log(user);
    loginEmailError.innerHTML = "";
    loginMdpError.innerHTML = "";

    // Vérification des critères de l'email et du mdp.
    if (!user.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/g) || !user.password.match(/^[a-zA-Z0-9]+$/g)) {
        return;
    }

    try {
        // Vérification de la combinaison email/mdp.
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        });

        const result = await response.json();

        console.log(result);

        // Si la combinaison email/mdp est invalide.
        if (result.error || result.message) {
            const p = document.createElement("p");
            p.innerHTML = "La combinaison e-mail/mot de passe est incorrecte.";
            loginMdpError.appendChild(p);

        // Si la combinaison email/mdp est valide.
        } else if (result.token) {
            localStorage.setItem("token", result.token);

            // L'utilisateur est redirigé sur la page d'accueil
            window.location.href = "index.html";
        }
    // L'utilisateur est alerté en cas d'erreur.
    } catch (error) {
        console.log(error);
    }
}
