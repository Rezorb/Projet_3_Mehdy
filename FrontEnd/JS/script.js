const url = "http://localhost:5678/api/works";

const getArticles = () => {
    fetch(url)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            const gallery = document.querySelector("#portfolio .gallery");
            gallery.innerHTML = "";

            data.forEach(project => {
                const figure = document.createElement("figure");
                figure.className = "gallery-item";
                figure.setAttribute("data-category", project.category.name);

                const img = document.createElement("img");
                img.src = project.imageUrl;
                img.alt = project.title;

                const figcaption = document.createElement("figcaption");
                figcaption.textContent = project.title;

                figure.appendChild(img);
                figure.appendChild(figcaption);

                gallery.appendChild(figure);
            });

            addFilterButtons(data);
        });
};

getArticles();

const addFilterButtons = (data) => {
    const filters = ["Tous"];
    const categoriesSet = new Set();

    data.forEach(project => {
        categoriesSet.add(project.category.name);
    });

    categoriesSet.forEach(category => {
        filters.push(category);
    });

    const gallery = document.querySelector(".gallery");

    const filtersContainer = document.createElement("div");
    filtersContainer.className = "filters";

    filters.forEach(filterText => {
        const filterButton = document.createElement("button");
        filterButton.textContent = filterText;

        filterButton.addEventListener("click", () => {
            const selectedFilter = filterText;

            const allFigures = gallery.querySelectorAll(".gallery-item");

            allFigures.forEach(figure => {
                const category = figure.getAttribute("data-category");

                if (selectedFilter === "Tous" || category === selectedFilter) {
                    figure.style.display = "block";
                } else {
                    figure.style.display = "none";
                }
            });
        });

        filtersContainer.appendChild(filterButton);
    });

    const projectsSection = document.querySelector("#portfolio");
    projectsSection.insertBefore(filtersContainer, gallery);
};

function seConnecter() {
    const loginForm = document.querySelector(".loginForm");
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const loginData = {
            email: email,
            password: password
        };

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 200) {
                    sessionStorage.setItem("authToken", data.token);
                    console.log(data)
                    window.location.href = "./index.html";
                } else if (data.status === 401) {
                    console.error(data.message);
                } else if (data.status === 404) {
                    console.error(data.message);
                }
            })
            .catch((error) => {
                console.error("Erreur lors de la connexion : " + error);
            });
    });
}


// document.addEventListener("DOMContentLoaded", function () {
//     const loginForm = document.querySelector(".loginForm");
//     loginForm.addEventListener("submit", function (e) {
//         e.preventDefault();

//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;

//         fetch("http://localhost:5678/api/users/login", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ email, password }),
//         })
//             .then((response) => response.json())
//             .then((data) => {
//                 if (data.status === 200) {
//                     localStorage.setItem("authToken", data.token);
//                     window.location.href = "./index.html";
//                 } else if (data.status === 401) {
//                     console.error(data.message);
//                 } else if (data.status === 404) {
//                     console.error(data.message);
//                 }
//             })
//             .catch((error) => {
//                 console.error("Erreur lors de la connexion : " + error);
//             });
//     });
// });

let modal = null

const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
    modal = target;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    document.querySelector('.overlay').addEventListener('click', closeModal);
    document.querySelector('.overlay').style.display = "block";
    document.querySelector('.modal').classList.add('modal-open')

    const modalBody = target.querySelector('.modal_body');

    modalBody.innerHTML = '';

    fetch(url)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            data.forEach(project => {
                const imageContainer = document.createElement("div");
                imageContainer.className = "image-container";

                const image = document.createElement("img");
                image.src = project.imageUrl;
                image.alt = project.title;
                image.className = "modal-image";

                const trashIcon = document.createElement('i');
                trashIcon.className = 'fas fa-trash-can trash-icon';

                trashIcon.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const workId = project.id;
                    fetch(`http://localhost:5678/api/works/${workId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((response) => {
                            if (response.status === 204) {
                                imageContainer.remove();
                            } else {
                                console.error("Erreur lors de la suppression de l'élément.");
                            }
                        })
                        .catch((error) => {
                            console.error("Erreur lors de la suppression : " + error);
                        });
                });

                imageContainer.appendChild(image);
                imageContainer.appendChild(trashIcon);

                modalBody.appendChild(imageContainer);
            });
        });

};


const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    document.querySelector('.overlay').style.display = 'none';
    modal = null;
}


const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

if (modal !== null) {
    modal.addEventListener('click', function (e) {
        if (modal !== null && e.target !== modal && !modal.contains(e.target)) {
            closeModal(e);
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const modalElement = document.querySelector(".js-modal");
    if (modalElement) {
        modalElement.addEventListener("click", function () {
            const modal1 = document.getElementById("modal1");
            if (modal1) {
                modal1.style.display = "block";
            }
        });
    }
});


