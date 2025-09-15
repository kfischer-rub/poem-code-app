"use-strict";

import { generateRandomName } from "./sillyNames.js";

let agentName = localStorage.getItem("agentName");
if (agentName) {
  document.querySelector("#hidden_agentName").value = agentName;
  document.querySelector(".agentName-form").classList.add("hidden");
  document.querySelector(".agent-name-holder").innerText = agentName;
  document.querySelector(".welcome-back").classList.remove("hidden");
  document.querySelector(".ciphertext-form").classList.remove("hidden");
} else {
  document.querySelector(".agentName-form").classList.remove("hidden");
  document.querySelector(".welcome-back").classList.add("hidden");
  const agentNameInput = document.querySelector("#agentName");
  agentNameInput.value = generateRandomName();
  agentNameInput.addEventListener(`focus`, () => agentNameInput.select());
  const agentNameRefreshButton = document.querySelector(
    "#agentNameSuggestButton"
  );
  agentNameRefreshButton.addEventListener(
    "click",
    () => (agentNameInput.value = generateRandomName())
  );
}

function agentNameButtonHandler() {
  let agentName = String(document.querySelector("#agentName").value).trim();
  if (agentName) {
    localStorage.setItem("agentName", agentName.substring(0, 25));
    window.location = window.location.href.split("#")[0]; // better than location.reload(); because that would resubmit POST data
  }
}

document
  .querySelector("#agentNameButton")
  .addEventListener("click", agentNameButtonHandler);

document.querySelector(".editNameButton").addEventListener("click", () => {
  localStorage.removeItem("agentName");
  window.location = window.location.href.split("#")[0]; // better than location.reload(); because that would resubmit POST data
});

document.querySelector("#ciphertext").addEventListener("input", (evt) => {
  evt.target.value = evt.target.value.toUpperCase().replace(/[\s"'`'\d]/g, "");
});

// Example usage: Generate 5 random secret agent names
for (let i = 0; i < 5; i++) {
  console.log(generateRandomName());
}
