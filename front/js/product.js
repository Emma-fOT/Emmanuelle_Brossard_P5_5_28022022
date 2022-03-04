// "ShowProduct" reads the data from the json file to create the Kanap product page

function showProduct(jsonObj) {
  const MyProduct = jsonObj;

  const picture = document.createElement("img");
  picture.src = `${MyProduct.imageUrl}`;
  picture.alt = `${MyProduct.altTxt}`;
  const MyImageContainer = document.getElementsByClassName("item__img")[0];
  MyImageContainer.appendChild(picture);

  document.getElementById("title").textContent = MyProduct.name;
  document.getElementById("price").textContent = MyProduct.price;
  document.getElementById("description").textContent = MyProduct.description;

  const MyColorOptions = MyProduct.colors;
  const MyColorMenu = document.getElementById("colors");
  for (let i = 0; i < MyColorOptions.length; i += 1) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = MyColorOptions[i];
    MyColorMenu.appendChild(opt);
  }
}

// "findID" reads the data from the json file to create the page of each Kanap

function findID() {
  const queryString = window.location.search;
  const urlParameters = new URLSearchParams(queryString);
  return urlParameters.get("id");
}

// Loading of the product page

document.addEventListener("DOMContentLoaded", () => {
  const productID = findID();
  const APILink = "http://localhost:3000/api/products/" + productID;
  //Link to the API
  fetch(APILink)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (value) {
      showProduct(value);
    })
    .catch(function (err) {
      // Une erreur est survenue
    });
});
