function setupDropdown(
  dropdownButtonId,
  dropdownMenuId,
  searchInputId,
  resetButtonId = null
) {
  const dropdownButton = document.getElementById(dropdownButtonId);
  const dropdownMenu = document.getElementById(dropdownMenuId);
  const searchInput = document.getElementById(searchInputId);
  const resetButton = resetButtonId
    ? document.getElementById(resetButtonId)
    : null;

  dropdownButton.addEventListener("click", function (event) {
    event.stopPropagation();
    if (dropdownMenu.style.display === "none") {
      dropdownMenu.style.display = "block";
    } else {
      dropdownMenu.style.display = "none";
    }
  });

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const items = dropdownMenu.querySelectorAll('div[role="menuitem"]');

    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(searchTerm)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });

  dropdownMenu.addEventListener("click", function (event) {
    if (event.target.role === "menuitem") {
      dropdownButton.querySelector("span").textContent =
        event.target.textContent;
      dropdownMenu.style.display = "none";
      if (resetButton) {
        resetButton.querySelector("span").textContent = "Select District";
      }
    }
  });

  window.addEventListener("click", function (event) {
    if (!dropdownMenu.contains(event.target)) {
      dropdownMenu.style.display = "none";
    }
  });
}

setupDropdown("states-menu", "dropdown-menu", "search-input", "district-menu");
setupDropdown(
  "district-menu",
  "district-dropdown-menu",
  "district-search-input"
);

async function populateStates() {
  const response = await fetch("/getStates");
  const states = await response.json();

  const dropdownMenu = document.getElementById("dropdown-menu");
  for (let state of states) {
    let div = document.createElement("div");
    div.textContent = state;
    div.className =
      "cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 py-2 px-4";
    div.role = "menuitem";
    dropdownMenu.appendChild(div);
  }
}

async function populateDistricts(state) {
  const response = await fetch(`/getDistricts?state=${state}`);
  const districts = await response.json();

  const dropdownMenu = document.getElementById("district-dropdown-menu");
  const searchInputContainer = dropdownMenu.querySelector('div[role="menu"]');

  // Remove all existing menu items
  dropdownMenu
    .querySelectorAll('div[role="menuitem"]')
    .forEach((item) => item.remove());

  for (let district of districts) {
    let div = document.createElement("div");
    div.textContent = district;
    div.className =
      "cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 py-2 px-4";
    div.role = "menuitem";
    searchInputContainer.appendChild(div);
  }
}

document
  .getElementById("dropdown-menu")
  .addEventListener("click", function (event) {
    if (event.target.role === "menuitem") {
      populateDistricts(event.target.textContent);
    }
  });

populateStates();
