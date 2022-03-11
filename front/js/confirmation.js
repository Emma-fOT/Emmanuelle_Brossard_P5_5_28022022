// "findID" reads the id in the url in order to know the id of the order

function findID(parameter) {
  const queryString = window.location.search;
  const urlParameters = new URLSearchParams(queryString);
  return urlParameters.get(parameter);
}

// Loading of the product page

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("orderId").textContent = findID("orderId");
});
