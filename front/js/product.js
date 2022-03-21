// "ShowProduct" reads the data from the json file to create the Kanap product page

function showProduct(MyProductJson) {
  const picture = document.createElement("img");
  picture.src = `${MyProductJson.imageUrl}`;
  picture.alt = `${MyProductJson.altTxt}`;

  const MyImageContainer = document.getElementsByClassName("item__img")[0];
  MyImageContainer.appendChild(picture);

  document.getElementById("title").textContent = MyProductJson.name;

  document.getElementById("price").textContent = MyProductJson.price;

  document.getElementById("description").textContent = MyProductJson.description;

  const MyColorOptions = MyProductJson.colors;
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
    .then((response) => response.json())
    .then((value) => showProduct(value))
    .catch((error) => alert("Problème au chargement de la page : \n" + error));
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

// Add a product to the cart

function addToCart(MyProductToAddJson) {
  let currentCart = getCart(); // Take the infos of the current cart
  let thisProduct = currentCart.find((p) => p.ID === MyProductToAddJson.ID && p.Color === MyProductToAddJson.Color); // Check if a product is already in the cart
  if (thisProduct != undefined) {
    let NewQty = +thisProduct.Quantity; // "+" is here to have a number
    NewQty += MyProductToAddJson.Quantity; // Increase the quantity
    if (NewQty > 100) {
      if (
        window.confirm(
          "Ce produit n'a pas été ajouté à votre panier.\nCe produit est déjà dans votre panier et la quantité totale dépasse la quantité maximale autorisée (100 unités par produit par couleur). Voulez-vous voir votre panier ?"
        )
      ) {
        document.location.href = "../html/cart.html";
        return; // We stop here, we don't add the product anyway because qty>100
      } else {
        return; // We stop here, we don't add the product anyway because qty>100
      }
    } else {
      thisProduct.Quantity = NewQty;
    }
  } else {
    currentCart.push(MyProductToAddJson); // Create a new localStorage item
  }
  localStorage.setItem("myCart", JSON.stringify(currentCart)); // Save the new cart
  if (window.confirm("Produit ajouté au panier.\nVoulez-vous aller aller au panier ?")) {
    document.location.href = "../html/cart.html";
  } else {
    document.location.href = "../html/index.html";
  }
}

// Listening the click on the "AddToCart" button and add some Kanap when clicking on it

document.getElementById("addToCart").addEventListener("click", function () {
  try {
    // Take the informations of the product to add
    const productID = findID();
    const productColor = document.getElementById("colors").options[document.getElementById("colors").selectedIndex].text;
    const productQty = +document.getElementById("quantity").value;
    let MyProductToAddJson = {
      ID: productID,
      Color: productColor,
      Quantity: productQty,
    };
    // Tests before adding to the cart
    if ((productQty > 0) & (productQty <= 100)) {
      if (productColor === "--SVP, choisissez une couleur --") {
        alert("Vous devez choisir une couleur pour ce produit.");
      } else {
        addToCart(MyProductToAddJson);
      }
    } else {
      alert("La quantité souhaitée est incorrecte. Elle doit être comprise entre 1 et 100.");
    }
  } catch {
    (error) => alert("Problème lors de l'ajout du produit au panier : \n" + error);
  }
});
