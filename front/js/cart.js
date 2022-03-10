// Return the JSON of the current cart (local storage)

function getCart() {
  const cart = localStorage.getItem("myCart");
  if (cart == null) {
    return [];
  } else {
    return JSON.parse(cart);
  }
}

// Display of the cart
function displayCart(listOfKanaps, totalPrice, totalOfProducts) {
  //Dynamic creation of the html elements of the cart
  let finalCart = getCart();
  for (let i = 0; i < finalCart.length; i++) {
    let productInTheList = listOfKanaps.find((p) => p._id === finalCart[i].ID);
    if (productInTheList != undefined) {
      const productItem = document.createElement("article");
      const productPictureContainer = document.createElement("div");
      const productPicture = document.createElement("img");
      const productTextContainer = document.createElement("div");
      const productDescriptionContainer = document.createElement("div");
      const productName = document.createElement("h2");
      const productColor = document.createElement("p");
      const productPrice = document.createElement("p");
      const productSettingsContainer = document.createElement("div");
      const productQuantityContainer = document.createElement("div");
      const productQuantityText = document.createElement("p");
      const productQuantityNumber = document.createElement("input");
      const productDeleteContainer = document.createElement("div");
      const productDelete = document.createElement("p");

      productItem.classList.add("cart__item");
      productItem.setAttribute("data-id", finalCart[i].ID);
      productItem.setAttribute("data-color", finalCart[i].Color);
      productPictureContainer.classList.add("cart__item__img");
      productPicture.src = productInTheList.imageUrl;
      productPicture.alt = productInTheList.altTxt;
      productPictureContainer.appendChild(productPicture);
      productTextContainer.classList.add("cart__item__content");
      productDescriptionContainer.classList.add(
        "cart__item__content__description"
      );
      productName.textContent = productInTheList.name;
      productColor.textContent = finalCart[i].Color;
      productPrice.textContent = productInTheList.price + " €";
      productDescriptionContainer.appendChild(productName);
      productDescriptionContainer.appendChild(productColor);
      productDescriptionContainer.appendChild(productPrice);
      productSettingsContainer.classList.add("cart__item__content__settings");
      productQuantityContainer.classList.add(
        "cart__item__content__settings__quantity"
      );
      productQuantityText.textContent = "Qté : ";
      productQuantityNumber.setAttribute("type", "number");
      productQuantityNumber.setAttribute("name", "itemQuantity");
      productQuantityNumber.setAttribute("min", "1");
      productQuantityNumber.setAttribute("max", "100");
      productQuantityNumber.setAttribute("value", finalCart[i].Quantity);
      productQuantityNumber.classList.add("itemQuantity");
      productQuantityContainer.appendChild(productQuantityText);
      productQuantityContainer.appendChild(productQuantityNumber);
      productDeleteContainer.classList.add(
        "cart__item__content__settings__delete"
      );
      productDelete.classList.add("deleteItem");
      productDelete.textContent = "Supprimer";
      productDeleteContainer.appendChild(productDelete);
      productSettingsContainer.appendChild(productQuantityContainer);
      productSettingsContainer.appendChild(productDeleteContainer);
      productTextContainer.appendChild(productDescriptionContainer);
      productTextContainer.appendChild(productSettingsContainer);
      productItem.appendChild(productPictureContainer);
      productItem.appendChild(productTextContainer);
      const cartTable = document.getElementById("cart__items");
      cartTable.appendChild(productItem);
    }
  }
  calculateTotals(listOfKanaps);
}

// Loading of the cart page

document.addEventListener("DOMContentLoaded", () => {
  //Link to the API
  fetch("http://localhost:3000/api/products")
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (value) {
      var totalPrice = 0;
      var totalOfProducts = 0;
      displayCart(value, totalPrice, totalOfProducts);
      changeQuantity(value);
      deleteProduct(value);
    })
    .catch(function (err) {
      // Une erreur est survenue
    });
});

//Suppression of a product
function updateDisplay(theProduct) {
  const thisProduct = theProduct.closest(".cart__item");
  thisProduct.parentNode.removeChild(thisProduct);
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
    }
  }
}

//Modify the local storage
function updateCart(theProduct, newValue, listOfKanaps) {
  const thisProduct = theProduct.closest(".cart__item");
  const thisID = thisProduct.dataset.id;
  const thisColor = thisProduct.dataset.color;
  let currentCart = getCart();
  let thisProductToChange = currentCart.find(
    (p) => p.ID === thisID && p.Color === thisColor
  );
  thisProductToChange.Quantity = newValue;
  if (newValue == 0) {
    updateDisplay(theProduct);
    currentCart = currentCart.filter(
      (p) => p.ID != thisID && p.Color != thisColor
    ); //delete this entry in the localstorage
  }
  console.log(currentCart);
  localStorage.setItem("myCart", JSON.stringify(currentCart));
  calculateTotals(listOfKanaps);
}

//Management of any product suppression
function deleteProduct(listOfKanaps) {
  var productsSuppressions = document.getElementsByClassName("deleteItem");
  for (var i = 0; i < productsSuppressions.length; i++) {
    productsSuppressions[i].addEventListener("click", function () {
      const newValue = 0;
      updateCart(this, newValue, listOfKanaps);
    });
  }
}

//Management of any quantity change
function changeQuantity(listOfKanaps) {
  var productsQuantities = document.getElementsByClassName("itemQuantity");
  for (var i = 0; i < productsQuantities.length; i++) {
    productsQuantities[i].addEventListener("change", function () {
      const newValue = this.value;
      if (newValue >= 0) {
        if (newValue <= 101) {
          updateCart(this, newValue, listOfKanaps);
        } else {
          alert(
            "Attention, vous ne pouvez pas commander plus de 100 unités d'un même produit."
          );
        }
      } else {
        if (newValue < 0) {
          alert("Vous ne pouvez pas commander un nombre de produit négatif.");
          this.value = 1;
        }
      }
    });
  }
}

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
    .then((res) => res.json())
    .then((value) => {
      document.location.href =
        "../html/confirmation.html?orderId=" + value.orderId;
      localStorage.clear();
    })
    .catch((err) => {
      //erreur
    });
  document.getElementsByClassName("cart__order__form")[0].reset();
}

//Validation of the contact form
function validate(errorCounter) {
  //DOM elements
  var firstName = document.getElementById("firstName");
  var lastName = document.getElementById("lastName");
  var address = document.getElementById("address");
  var city = document.getElementById("city");
  var email = document.getElementById("email");
  const email_regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const txt_regex = /^[A-Za-zÀ-ÖØ-öø-ÿ -]{2,}$/;
  const txt_and_number_regex = /^[A-Za-zÀ-ÖØ-öø-ÿ, -']{2,}$/;
  errorCounter = checkData(
    firstName,
    txt_regex,
    errorCounter,
    "Ce champ doit contenir au moins 2 caractères et uniquement des lettres."
  );
  errorCounter = checkData(
    lastName,
    txt_regex,
    errorCounter,
    "Ce champ doit contenir au moins 2 caractères et uniquement des lettres."
  );
  errorCounter = checkData(
    city,
    txt_regex,
    errorCounter,
    "Ce champ doit contenir au moins 2 caractères et uniquement des lettres."
  );
  errorCounter = checkData(
    address,
    txt_and_number_regex,
    errorCounter,
    "Ce champ doit contenir au moins 2 caractères (majuscules, minuscules, nombres)."
  );
  errorCounter = checkData(
    email,
    email_regex,
    errorCounter,
    "Ce champ doit contenir une adresse mail valide."
  );

  //Validation of the form if everything is ok
  if (errorCounter === 0) {
    let contact = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    };
    const fullProducts = getCart();
    let products = [];
    for (let i = 0; i < fullProducts.length; i++) {
      products.push(fullProducts[i].ID);
    }
    let cartToSend = {
      contact,
      products,
    };
    sendToAPI(cartToSend);
  }
}

//Listening the click on the "Commander !" button
document.getElementById("order").addEventListener("click", function (event) {
  event.preventDefault();
  var errorCounter = 0;
  validate(errorCounter);
});
