// "Showcards" reads the data from the json file to create the kanap cards

function showCards(listOfKanaps) {
  const placeForCards = document.querySelector("main div section");

  for (let i = 0; i < listOfKanaps.length; i += 1) {
    const picture = document.createElement("img");
    picture.src = `${listOfKanaps[i].imageUrl}`;
    picture.alt = `${listOfKanaps[i].altTxt}, ${listOfKanaps[i].name}`;

    const name = document.createElement("h3");
    name.textContent = listOfKanaps[i].name;
    name.classList.add("productName");

    const description = document.createElement("p");
    description.textContent = listOfKanaps[i].description;
    description.classList.add("productDescription");

    const card = document.createElement("article");
    card.appendChild(picture);
    card.appendChild(name);
    card.appendChild(description);

    const link = document.createElement("a");
    link.href = `../html/product.html?id=${listOfKanaps[i]._id}`;
    link.appendChild(card);

    placeForCards.appendChild(link);
  }
}

// Loading of the main page

document.addEventListener("DOMContentLoaded", () => {
  //Link to the API
  fetch("http://localhost:3000/api/products")
    // We don't need to add a second argument because the default value is what we need: GET
    .then((response) => response.json())
    // The answer of the fetch is a promise, this promise is solved with the "response" object
    //Note: it's possible to check if the response "succeeds" thanks to response.ok (boolean)
    //Note 2: the "json" method tells the format we want for the response
    .then((value) => showCards(value))
    .catch((error) => alert("Problème au chargement de la page : \n" + error));
  //Pops up if there is a problem
});
