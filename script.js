// ---------------------------------------------
// CARD DATA
// ---------------------------------------------
const cards = [
  { name: "Neo Genesis 080", img: "images/neo1-080.webp", price: 1.35 },
  { name: "Neo Genesis 081", img: "images/neo1-081.webp", price: 1.25 },
  { name: "Neo Destiny 85", img: "images/neo4-085.webp", price: 2.66 },
  { name: "Expedition Base 134", img: "images/ecard1-134.webp", price: 24.89 },
  { name: "Expedition Base 134 [R]", img: "images/ecard1-134.webp", price: 63.00, reverseHolo: true },
  { name: "Expedition Base 135", img: "images/ecard1-135.webp", price: 11.56 },
  { name: "Expedition Base 135 [R]", img: "images/ecard1-135.webp", price: 46.66, reverseHolo: true },
  { name: "Hidden Legends 79", img: "images/ex5-079.webp", price: 0.59 },
  { name: "Hidden Legends 79 [R]", img: "images/ex5-079.webp", price: 25.72, reverseHolo: true }
];


// ---------------------------------------------
// STATE
// ---------------------------------------------
let currentSpread = 0;
let currentCard = null;
let currentCardDiv = null;

const pages = chunk(cards, 4); // 4 cards per page


// ---------------------------------------------
// INIT
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderSpread();

  document.getElementById("nav-left").onclick = () => {
    currentSpread = Math.max(0, currentSpread - 1);
    renderSpread();
  };

  document.getElementById("nav-right").onclick = () => {
    const max = Math.floor((pages.length - 1) / 2);
    currentSpread = Math.min(max, currentSpread + 1);
    renderSpread();
  };

  document.getElementById("close-popup").onclick = () =>
    document.getElementById("card-popup").classList.add("hidden");

  document.getElementById("owned-checkbox").onchange = toggleOwned;
});


// ---------------------------------------------
// RENDER SPREAD
// ---------------------------------------------
function renderSpread() {
  const binder = document.getElementById("binder");
  binder.innerHTML = "";

  const left = pages[currentSpread * 2];
  const right = pages[currentSpread * 2 + 1];

  [left, right].forEach(page => {
    if (!page) return;

    const pageDiv = document.createElement("div");
    pageDiv.className = "binder-page";

    page.forEach(card => pageDiv.appendChild(createCard(card)));
    binder.appendChild(pageDiv);
  });
}


// ---------------------------------------------
// CREATE CARD
// ---------------------------------------------
function createCard(card) {
  const div = document.createElement("div");
  div.className = "card";
  div.dataset.name = card.name;

  if (card.reverseHolo) div.classList.add("reverse-holo");
  if (localStorage.getItem(card.name)) div.classList.add("owned");

  div.innerHTML = `<img src="${card.img}" alt="${card.name}">`;
  div.onclick = () => openPopup(card, div);

  return div;
}


// ---------------------------------------------
// POPUP
// ---------------------------------------------
function openPopup(card, div) {
  currentCard = card;
  currentCardDiv = div;

  document.getElementById("popup-name").textContent = card.name;
  document.getElementById("popup-preview").src = card.img;
  document.getElementById("popup-price").textContent =
    card.price ? `€${card.price.toFixed(2)}` : "";

  document.getElementById("owned-checkbox").checked =
    !!localStorage.getItem(card.name);

  document.getElementById("card-popup").classList.remove("hidden");
}


// ---------------------------------------------
// OWNED CHECKBOX
// ---------------------------------------------
function toggleOwned() {
  if (!currentCard) return;

  const key = currentCard.name;

  if (this.checked) {
    localStorage.setItem(key, "owned");
    currentCardDiv.classList.add("owned");
  } else {
    localStorage.removeItem(key);
    currentCardDiv.classList.remove("owned");
  }
}


// ---------------------------------------------
// UTILITY
// ---------------------------------------------
function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
