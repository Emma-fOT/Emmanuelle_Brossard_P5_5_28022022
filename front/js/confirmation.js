// "findID" reads the id in the url in order to know on which Kanap the use clicks

function findID() {
  const queryString = window.location.search;
  const urlParameters = new URLSearchParams(queryString);
  return urlParameters.get("orderId");
}

// Loading of the product page

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("orderId").textContent = findID();
});
