
//*** Page d'accueil ***//

const btnAll = document.querySelector(".filter__btn-id-null");
const btnId1 = document.querySelector(".filter__btn-id-1");
const btnId2 = document.querySelector(".filter__btn-id-2");
const btnId3 = document.querySelector(".filter__btn-id-3");

const sectionProjets = document.querySelector(".gallery");

let data = null;
let id;
generationProjets(data, null);

// Reset la section projets.
function resetSectionProjets() {
    sectionProjets.innerHTML = "";
}

// Génération des projets.
async function generationProjets(data, id) {
    const response = await fetch('http://localhost:5678/api/works');
    data = await response.json();

    resetSectionProjets()

    // Filtrer les résultats.
    if ([1, 2, 3].includes(id)) {
        data = data.filter(data => data.categoryId == id);
    }

    // Changer la couleur du bouton en fonction du filtre.
    document.querySelectorAll(".filter__btn").forEach(btn => {
        btn.classList.remove("filter__btn--active");
    })
    document.querySelector(`.filter__btn-id-${id}`).classList.add("filter__btn--active");

    if (data.length === 0 || data === undefined) {
        const p = document.createElement("p");
        p.classList.add("error");
        p.innerHTML = "Aucun projet à afficher.";
        sectionProjets.appendChild(p);
        return;
    }

    // Générer les projets.
    if (id === null || [1, 2, 3].includes(id)) {
        for (let i = 0; i < data.length; i++) {

            const figure = document.createElement("figure");
            sectionProjets.appendChild(figure);
            figure.classList.add(`js-projet-${data[i].id}`);
            const img = document.createElement("img");
            img.src = data[i].imageUrl;
            img.alt = data[i].title;
            figure.appendChild(img);

            const figcaption = document.createElement("figcaption");
            figcaption.innerHTML = data[i].title;
            figure.appendChild(figcaption);
        }
    }
}


//*** Filtres ***//

btnAll.addEventListener("click", () => { // Tous les projets
    generationProjets(data, null);
})

btnId1.addEventListener("click", () => { // Objets
    generationProjets(data, 1);
})

btnId2.addEventListener("click", () => { // Appartements
    generationProjets(data, 2);
})

btnId3.addEventListener("click", () => { // Hôtels & restaurants
    generationProjets(data, 3);
})



/***************************************************************************************/


//*** Gestion de la modale ***//


// Reset la section projets.
function resetmodaleSectionProjets() {
    modaleSectionProjets.innerHTML = "";
}

// Ouverture de la modale.
let modale = null;
let dataAdmin;
const modaleSectionProjets = document.querySelector(".js-admin-projets");

const openModale = function (e) {
    e.preventDefault()
    modale = document.querySelector(e.target.getAttribute("href"))

    modaleProjets();
    setTimeout(() => {
        modale.style.display = null
        modale.removeAttribute("aria-hidden")
        modale.setAttribute("aria-modal", "true")
    }, 25);
    // EventListener -> ouvrir la modale projet.
    document.querySelectorAll(".js-modale-projet").forEach(a => {
        a.addEventListener("click", openModaleProjet)
    });

    // Fermeture de la modale.
    modale.addEventListener("click", closeModale)
    modale.querySelector(".js-modale-close").addEventListener("click", closeModale)
    modale.querySelector(".js-modale-stop").addEventListener("click", stopPropagation)
};

// Générer les projets dans la modale admin.
async function modaleProjets() {
    const response = await fetch('http://localhost:5678/api/works');
    dataAdmin = await response.json();
    resetmodaleSectionProjets()
    for (let i = 0; i < dataAdmin.length; i++) {

        const div = document.createElement("div");
        div.classList.add("gallery__item-modale");
        modaleSectionProjets.appendChild(div);

        const img = document.createElement("img");
        img.src = dataAdmin[i].imageUrl;
        img.alt = dataAdmin[i].title;
        div.appendChild(img);

        const p = document.createElement("p");
        div.appendChild(p);
        p.classList.add(dataAdmin[i].id, "js-delete-work");

        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can");
        p.appendChild(icon);
    }
    deleteWork()
}

//  Fermeture de la modale.
const closeModale = function (e) {
    e.preventDefault()
    if (modale === null) return


    modale.setAttribute("aria-hidden", "true")
    modale.removeAttribute("aria-modal")

    modale.querySelector(".js-modale-close").removeEventListener("click", closeModale)

    // Fermeture de la modale apres 400ms.
    window.setTimeout(function () {
        modale.style.display = "none"
        modale = null
        resetmodaleSectionProjets()
    }, 300)
};

// Définir le click pour fermer la modale.
const stopPropagation = function (e) {
    e.stopPropagation()
};
// Sélectionner les éléments qui ouvrent la modale.
document.querySelectorAll(".js-modale").forEach(a => {
    a.addEventListener("click", openModale)
});


//*** Gestion du Token ***//


// Récupération du token.
const token = localStorage.getItem("token");
const AlreadyLogged = document.querySelector(".js-already-logged");

adminPanel()
// Gestion de l'affichage des boutons admin.
function adminPanel() {
    document.querySelectorAll(".admin__modifer").forEach(a => {
        if (token === null) {
            return;
        }
        else {
            a.removeAttribute("aria-hidden")
            a.removeAttribute("style")
            AlreadyLogged.innerHTML = "logout";
        }
    });

    // Désactiver les filtres si l'utilisateur est connecté.
    if (token !== null) {
        document.querySelectorAll(".filter__btn").forEach(btn => {
            btn.setAttribute('aria-hidden', 'true');
            btn.style.display = "none";
        })
    }
}

//*** Suppression d'un projet ***//

function deleteWork() {
    let btnDelete = document.querySelectorAll(".js-delete-work");
    for (let i = 0; i < btnDelete.length; i++) {
        btnDelete[i].addEventListener("click", deleteProjets);
    }
}

// Supprimer un projet.
async function deleteProjets() {
    await fetch(`http://localhost:5678/api/works/${this.classList[0]}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    })
        .then(response => {
            console.log(response);
            // Le Token est valide.
            if (response.status === 204) {
                // Supprimer également du DOM.
                const projetId = this.classList[0];
                const projet = document.querySelector(`.js-projet-${projetId}`);
                if (projet) {
                    projet.style.display = "none";
                }
                modaleProjets();
            }
            // Le Token est invalide.
            else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à supprimer ce projet");
                window.location.href = "login.html";
            }
        })
        .catch(error => {
            console.log(error);
        });
}


//*** Gestion de l'ajout d'un projet ***//


// Ouverture de la modale projet.
let modaleProjet = null;
const openModaleProjet = function (e) {
    e.preventDefault();
    modaleProjet = document.querySelector(e.target.getAttribute("href"))

    updateAddButtonStyle();
    resetAddProjectModal();

    modaleProjet.style.display = null
    modaleProjet.removeAttribute("aria-hidden")
    modaleProjet.setAttribute("aria-modal", "true")

    // Fermeture modale.
    modaleProjet.addEventListener("click", closeModaleProjet)
    modaleProjet.querySelector(".js-modale-close").addEventListener("click", closeModaleProjet)
    modaleProjet.querySelector(".js-modale-stop").addEventListener("click", stopPropagation)

    modaleProjet.querySelector(".js-modale-return").addEventListener("click", backToModale)
};

// Fonction pour mettre à jour le style du bouton Ajouter.
function updateAddButtonStyle(image) {
    const btnAjouterProjet = document.querySelector(".js-add-work");
    const title = document.querySelector(".js-title").value;
    const categoryId = document.querySelector(".js-categoryId").value;

    // Vérifier si tous les champs sont remplis.
    if (title !== "" && categoryId !== "" && image !== undefined) {
        btnAjouterProjet.style.backgroundColor = "#1D6154";
    } else {
        btnAjouterProjet.style.backgroundColor = "#B3B3B3";
    }
}

document.querySelector(".js-title").addEventListener("input", updateAddButtonStyle);
document.querySelector(".js-categoryId").addEventListener("change", updateAddButtonStyle);
document.querySelector(".js-image").addEventListener("change", updateAddButtonStyle);

// Fermeture de la modale projet.
const closeModaleProjet = function (e) {
    e.preventDefault();
    if (modaleProjet === null) return

    modaleProjet.setAttribute("aria-hidden", "true")
    modaleProjet.removeAttribute("aria-modal")

    modaleProjet.querySelector(".js-modale-close").removeEventListener("click", closeModaleProjet)
    modaleProjet.querySelector(".js-modale-stop").removeEventListener("click", stopPropagation)

    modaleProjet.style.display = "none"
    modaleProjet = null

    closeModale(e)
};

// Retour au modale admin.
const backToModale = function (e) {
    e.preventDefault();
    modaleProjet.style.display = "none";
    modaleProjet = null;

    modaleProjets(dataAdmin);
};



//*** Gestion de l'ajout d'un projet ***//


const btnAjouterProjet = document.querySelector(".js-add-work");
btnAjouterProjet.addEventListener("click", addWork);

// Ajouter un projet.
async function addWork(event) {
    event.preventDefault();

    const title = document.querySelector(".js-title").value;
    const categoryId = document.querySelector(".js-categoryId").value;
    const image = fileInput.files[0];

    if (title === "" || categoryId === "" || image === undefined) {
        alert("Merci de remplir tous les champs");
        return;
    } else if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") {
        alert("Merci de choisir une catégorie valide");
        return;
    } else {
        try {
            // Créer un objet FormData pour envoyer les données.
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", categoryId);
            formData.append("image", image);

            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.status === 201) {

                modaleProjets(dataAdmin);
                backToModale(event);
                generationProjets(data, null);
                resetAddProjectModal();

            } else if (response.status === 400) {
                alert("Merci de remplir tous les champs");
            } else if (response.status === 500) {
                alert("Erreur serveur");
            } else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à ajouter un projet");
                window.location.href = "login.html";
            }

            updateAddButtonStyle();
        }

        catch (error) {
            console.log(error);
        }
    }
}

const uploadImageInput = document.querySelector(".js-image");
const projectUpload = document.querySelector("#previewImage");
const uploadContent = document.querySelector(".form-group-photo");
const submitProjet = document.querySelector(".js-add-work");

const titleInput = document.querySelector(".js-title");
const categoryIdInput = document.querySelector(".js-categoryId");

const backgroundModal = document.querySelector("#modals");

uploadImageInput.addEventListener("change", function () {
    uploadImage();
});

// Fonction pour afficher l'aperçu de l'image
function uploadImage() {
    if (uploadImageInput.files && uploadImageInput.files[0]) {
        const reader = new FileReader();
        const image = new Image();
        const fileName = uploadImageInput.files[0].name;

        reader.onload = event => {
            image.src = event.target.result;
            image.alt = fileName.split(".")[0];
        };

        // Remplacer le contenu existant avec la nouvelle image.
        uploadContent.style.display = "none";

        submitProjet.style.backgroundColor = "#1D6154";
        projectUpload.style.display = "block";
        backgroundPreview.style.backgroundColor = "#FFFFFF";
        reader.readAsDataURL(uploadImageInput.files[0]);
        projectUpload.appendChild(image);
    }
}

const fileInput = document.querySelector(".js-image");
const previewImage = document.getElementById("previewImage");

// Changement d'entrée d'image.
fileInput.addEventListener("change", updateAddButtonStyle);
fileInput.addEventListener("change", previewImageUpload);

// Fonction pour prévisualiser la nouvelle image.
function previewImageUpload() {
    const fichier = fileInput.files[0];
    if (fichier) {
        const lecteur = new FileReader();
        lecteur.onload = function (e) {
            // Création d'un nouvel élément image.
            const newImage = document.createElement("img");
            newImage.src = e.target.result;
            newImage.alt = fichier.name;

            // On remplace le contenu existant par la nouvelle image.
            const uploadContent = document.querySelector("#previewImage");
            uploadContent.innerHTML = "";
            uploadContent.appendChild(newImage);

            updateAddButtonStyle(fichier);
        };
        lecteur.readAsDataURL(fichier);
    }
}

// Fonction pour réinitialiser les champs du formulaire.
function resetAddProjectModal() {
    document.querySelector(".js-title").value = "";
    document.querySelector(".js-categoryId").value = "";
    document.querySelector(".js-image").value = "";

    // Réinitialiser l'aperçu de l'image.
    projectUpload.innerHTML = "";
    projectUpload.style.display = "none";
    uploadContent.style.display = "flex";

    updateAddButtonStyle();
}









