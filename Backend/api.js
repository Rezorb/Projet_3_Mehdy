const url = "http://localhost:5678/api/works"
const content = document.getElementById("portfolio")

const getArticles = () => {
    fetch(url)
    .then(function (res) {
        return res.json()
    })
    .then(function (data) {
        for(product in data) {
            content.innerHTML += 
        }


    })
}

getArticles