// "Showcards" reads the data from the json file to create the kanap cards

function showCards(listOfKanaps) {
  const placeForCards = document.querySelector("main div section");
  for (let i = 0; i < listOfKanaps.length; i += 1) {
    const link = document.createElement("a");
    const card = document.createElement("article");
    const picture = document.createElement("img");
    const name = document.createElement("h3");
    const description = document.createElement("p");

    link.href = `../html/product.html?id=${listOfKanaps[i]._id}`;
    picture.src = `${listOfKanaps[i].imageUrl}`;
    picture.alt = `${listOfKanaps[i].altTxt}, ${listOfKanaps[i].name}`;
    card.appendChild(picture);
    name.textContent = listOfKanaps[i].name;
    name.classList.add("productName");
    card.appendChild(name);
    description.textContent = listOfKanaps[i].description;
    description.classList.add("productDescription");
    card.appendChild(description);
    link.appendChild(card);
    placeForCards.appendChild(link);
  }
}

// Loading of the main page

document.addEventListener("DOMContentLoaded", () => {
  //Link to the API
  fetch("http://localhost:3000/api/products")
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (value) {
      showCards(value);
    })
    .catch(function (err) {
      // Une erreur est survenue
    });
});
