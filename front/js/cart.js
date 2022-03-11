// Return the JSON of the current cart (local storage)

function getCart() {
  const cart = localStorage.getItem("myCart");
  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}

//Calculate the total price and total quantity again and display it

function calculateTotals(listOfKanaps) {
  const totalCart = getCart();
  let totalPrice = 0;
  let totalOfProducts = 0;
  for (let i = 0; i < totalCart.length; i++) {
    let productInTheList = listOfKanaps.find((p) => p._id === totalCart[i].ID);
    if (productInTheList != undefined) {
      //Calculation of the total price
      totalPrice += productInTheList.price * totalCart[i].Quantity;
      document.getElementById("totalPrice").textContent = totalPrice;
      //Calculation of the total quantity
      totalOfProducts += parseInt(totalCart[i].Quantity);
      document.getElementById("totalQuantity").textContent = totalOfProducts;
    } else {
      alert("Problème dans le calcul du prix total ou de la quantité totale.\nUn produit n'est pas trouvé dans le catalogue.");
    }
  }
}

// Display a container

function displayContainer(ClassOfContainer, ChildsOfContainer) {
  const Container = document.createElement("div");
  Container.classList.add(ClassOfContainer);
  for (let i = 0; i < ChildsOfContainer.length; i++) {
    Container.appendChild(ChildsOfContainer[i]);
  }
  return Container;
}

// Display some text

function displayText(typeOfText, classOfText, textOfText) {
  const paragraphOfText = document.createElement(typeOfText);
  paragraphOfText.textContent = textOfText;
  if (classOfText != "") {
    for (let i = 0; i < classOfText.length; i++) {
      paragraphOfText.classList.add(classOfText);
    }
  }
  return paragraphOfText;
}

// Display of the cart

function displayCart(listOfKanaps) {
  //Dynamic creation of the html elements of the cart
  const finalCart = getCart();
  for (let i = 0; i < finalCart.length; i++) {
    let productInTheList = listOfKanaps.find((p) => p._id === finalCart[i].ID);
    if (productInTheList != undefined) {
      const productPicture = document.createElement("img");
      productPicture.src = productInTheList.imageUrl;
      productPicture.alt = productInTheList.altTxt;
      const productPictureContainer = displayContainer("cart__item__img", [productPicture]);

      const productName = displayText("h2", "", productInTheList.name);
      const productColor = displayText("p", "", finalCart[i].Color);
      const productPrice = displayText("p", "", productInTheList.price + " €");
      const productDescriptionContainer = displayContainer("cart__item__content__description", [productName, productColor, productPrice]);

      const productQuantityText = displayText("p", "", "Qté : ");
      const productQuantityNumber = document.createElement("input");
      productQuantityNumber.setAttribute("type", "number");
      productQuantityNumber.setAttribute("name", "itemQuantity");
      productQuantityNumber.setAttribute("min", "1");
      productQuantityNumber.setAttribute("max", "100");
      productQuantityNumber.setAttribute("value", finalCart[i].Quantity);
      productQuantityNumber.classList.add("itemQuantity");
      const productQuantityContainer = displayContainer("cart__item__content__settings__quantity", [
        productQuantityText,
        productQuantityNumber,
      ]);

      const productDelete = displayText("p", "deleteItem", "Supprimer");
      const productDeleteContainer = displayContainer("cart__item__content__settings__delete", [productDelete]);

      const productSettingsContainer = displayContainer("cart__item__content__settings", [
        productQuantityContainer,
        productDeleteContainer,
      ]);

      const productTextContainer = displayContainer("cart__item__content", [productDescriptionContainer, productSettingsContainer]);

      const productItem = document.createElement("article");
      productItem.classList.add("cart__item");
      productItem.setAttribute("data-id", finalCart[i].ID);
      productItem.setAttribute("data-color", finalCart[i].Color);
      productItem.appendChild(productPictureContainer);
      productItem.appendChild(productTextContainer);

      const cartTable = document.getElementById("cart__items");
      cartTable.appendChild(productItem);
    } else {
      alert("Problème d'affichage du panier.\nUn produit n'est pas trouvé dans le catalogue.");
    }
  }
  calculateTotals(listOfKanaps);
}

//Suppression of a product

function updateDisplay(theProduct) {
  const thisProduct = theProduct.closest(".cart__item");
  thisProduct.parentNode.removeChild(thisProduct);
}

//Modify the local storage

function updateCart(theProduct, newQuantity, listOfKanaps) {
  const thisProduct = theProduct.closest(".cart__item");
  const thisID = thisProduct.dataset.id;
  const thisColor = thisProduct.dataset.color;
  let currentCart = getCart();
  let thisProductToChange = currentCart.find((p) => p.ID === thisID && p.Color === thisColor);
  thisProductToChange.Quantity = newQuantity;
  if (newQuantity == 0) {
    updateDisplay(theProduct);
    currentCart = currentCart.filter((p) => p.ID != thisID && p.Color != thisColor); //delete this entry in the localstorage
  }
  localStorage.setItem("myCart", JSON.stringify(currentCart));
  calculateTotals(listOfKanaps);
}

//Management of any quantity change

function listenChangeQuantity(listOfKanaps) {
  var productsQuantities = document.getElementsByClassName("itemQuantity");
  for (let i = 0; i < productsQuantities.length; i++) {
    productsQuantities[i].addEventListener("change", function () {
      const newQuantity = this.value;
      if (newQuantity >= 0) {
        if (newQuantity <= 101) {
          updateCart(this, newQuantity, listOfKanaps);
        } else {
          alert("Attention, vous ne pouvez pas commander plus de 100 unités d'un même produit.");
        }
      } else {
        if (newQuantity < 0) {
          alert("Vous ne pouvez pas commander un nombre de produit négatif.");
          this.value = 1;
        }
      }
    });
  }
}

// Management of any product suppression

function listenDeleteProduct(listOfKanaps) {
  var productsSuppressions = document.getElementsByClassName("deleteItem");
  for (let i = 0; i < productsSuppressions.length; i++) {
    productsSuppressions[i].addEventListener("click", function () {
      const newQuantity = 0;
      updateCart(this, newQuantity, listOfKanaps);
    });
  }
}

// Loading of the cart page

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then(function (value) {
      displayCart(value);
      listenChangeQuantity(value);
      listenDeleteProduct(value);
    })
    .catch((error) => alert("Problème au chargement de la page : \n" + error));
});

//Tests with regex
function checkData(data, regex, errorCounter, msg) {
  if (!regex.test(data.value.trim())) {
    document.getElementById(data.name + "ErrorMsg").innerHTML = msg;
    errorCounter++;
  } else {
    document.getElementById(data.name + "ErrorMsg").innerHTML = "";
  }
  return errorCounter;
}

//Send the infos to the API

function sendToAPI(data) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((value) => {
      document.location.href = "../html/confirmation.html?orderId=" + value.orderId;
      localStorage.clear();
    })
    .catch((error) => alert("Problème lors de l'envoi de la commande : \n" + error));
  document.getElementsByClassName("cart__order__form")[0].reset();
}

//Validation of the contact

function validate() {
  var errorCounter = 0;
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const email = document.getElementById("email");
  const email_regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const txt_regex = /^[A-Za-zÀ-ÖØ-öø-ÿ -]{2,}$/;
  const txt_and_number_regex = /^[A-Za-zÀ-ÖØ-öø-ÿ, -']{2,}$/;
  errorCounter = checkData(firstName, txt_regex, errorCounter, "Ce champ doit contenir au moins 2 caractères et uniquement des lettres.");
  errorCounter = checkData(lastName, txt_regex, errorCounter, "Ce champ doit contenir au moins 2 caractères et uniquement des lettres.");
  errorCounter = checkData(city, txt_regex, errorCounter, "Ce champ doit contenir au moins 2 caractères et uniquement des lettres.");
  errorCounter = checkData(
    address,
    txt_and_number_regex,
    errorCounter,
    "Ce champ doit contenir au moins 2 caractères (majuscules, minuscules, nombres)."
  );
  errorCounter = checkData(email, email_regex, errorCounter, "Ce champ doit contenir une adresse mail valide.");

  if (errorCounter === 0) {
    const contact = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    };
    const fullProducts = getCart();
    if (fullProducts.length === 0) {
      alert("Le panier est vide. Commande annulée");
      return;
    } else {
      let products = [];
      for (let i = 0; i < fullProducts.length; i++) {
        products.push(fullProducts[i].ID);
      }
      const cartToSend = {
        contact,
        products,
      };
      sendToAPI(cartToSend);
    }
  }
}

//Listening the click on the "Commander !" button

document.getElementById("order").addEventListener("click", function (event) {
  event.preventDefault();
  validate();
});
