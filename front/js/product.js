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

// "findID" reads the id in the url in order to know on which Kanap the use clicks

function findID() {
  const queryString = window.location.search;
  const urlParameters = new URLSearchParams(queryString);
  return urlParameters.get("id");
}

// Loading of the product page

document.addEventListener("DOMContentLoaded", () => {
  const productID = findID();
  const APILink = "http://localhost:3000/api/products/" + productID;
  //Link to the API (to one product, not to all the products)
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

// Return the JSON of the current cart (local storage)

function getCart() {
  const cart = localStorage.getItem("myCart");
  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}

// Add some Kanap when clicking on "Add"

function addToCart() {
  //Take the informations of the product to add
  const productID = findID();
  const productColor =
    document.getElementById("colors").options[
      document.getElementById("colors").selectedIndex
    ].text;
  const productQty = +document.getElementById("quantity").value;
  let MyCartJson = {
    ID: productID,
    Color: productColor,
    Quantity: productQty,
  };
  //Tests before adding to the cart
  if (productQty === 0 || productColor === "--SVP, choisissez une couleur --") {
    alert("Vous devez choisir une couleur et une quantité du produit.");
    return;
  }
  //Take the infos of the current cart
  let currentCart = getCart();
  //Check if a product is already in the cart
  let thisProduct = currentCart.find(
    (p) => p.ID === productID && p.Color === productColor
  );
  if (thisProduct != undefined) {
    //Increase the quantity
    thisProduct.Quantity += productQty;
  } else {
    //Create a new localStorage item
    currentCart.push(MyCartJson);
  }
  //Save the new cart
  localStorage.setItem("myCart", JSON.stringify(currentCart));
  console.log(currentCart);
}

function cleanCart() {
  localStorage.clear();
}

//Listening the click on the "AddToCart" button
document.getElementById("addToCart").addEventListener("click", addToCart);
