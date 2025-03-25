const extensionsContainer = document.getElementById("extensions-container");
const filterContainer = document.getElementById("filter-container");
const themeSwitcher = document.getElementById("theme-switcher");

const initState = {
    allExtension: []
}

initApp();
bendEvents();

function initApp() {
    fetch("./data.json")
        .then(resp => resp.json())
        .then(data => {
            initState.allExtension = data;
            initState.allExtension.forEach((extension) => createExtension(extension));
        })
        .catch(error => console.error("Error loading data:", error));
    
    checkTheme();
};

function bendEvents() {
    themeSwitcher.addEventListener("click", handleThemeSwitching);
    themeSwitcher.addEventListener("keydown", (e) => handleKeyPressing(e, e.target.getAttribute("id") == "theme-switcher"));
    extensionsContainer.addEventListener("click", (e) => handleExtensionsClicking(e));
    extensionsContainer.addEventListener("keydown", (e) => handleKeyPressing(e, e.target.closest(".main__content__ext__remove") || e.target.closest(".main__content__ext__active")));
    filterContainer.addEventListener("click", (e) => handleFilterClicking(e));
    filterContainer.addEventListener("keydown", (e) => handleKeyPressing(e, e.target.tagName == "LABEL"));
};

function checkTheme() {
    if (localStorage.getItem("theme") == "light") {
        themeSwitcher.classList.add("light");
        document.documentElement.classList.add("light");
    }
};

function handleThemeSwitching() {
    const isLight = themeSwitcher.classList.toggle("light");
    document.documentElement.classList.toggle("light", isLight);
    localStorage.setItem("theme", isLight? "light": "dark");
};

function createExtension(extension) {
    const ext = document.createElement("div");
    ext.classList.add("main__content__ext");
    ext.dataset.active = extension.isActive;
    ext.dataset.name = extension.name;
    ext.innerHTML = `
        <div class="main__content__ext__header">
            <figure class="main__content__ext__img"><img src="${extension.logo}" alt="${extension.name} logo"></figure>
            <div class="main__content__ext__txt">
                <h2 class="main__content__ext__name">${extension.name}</h2>
                <p class="main__content__ext__desc">${extension.description}</p>
            </div>
        </div>
        <div class="main__content__ext__info">
            <button class="main__content__ext__remove">Remove</button>
            <div class="main__content__ext__active ${extension.isActive? "checked": ""}" tabindex="0"></div>
        </div>
    `;

    extensionsContainer.append(ext);
};

function handleExtensionsClicking(e) {
    if (e.target.closest(".main__content__ext__active")) {
        let closestExt = e.target.closest(".main__content__ext");
        let isChecked = e.target.classList.toggle("checked");
        
        closestExt.dataset.active = isChecked;
        initState.allExtension.forEach(ext => {
            if (ext.name == closestExt.dataset.name) {
                ext.isActive = isChecked;
            }
        })
    } else if (e.target.closest(".main__content__ext__remove")) {
        initState.allExtension = initState.allExtension.filter(ext => ext.name != e.target.closest(".main__content__ext").dataset.name);
        e.target.closest(".main__content__ext").remove();
    }
};

function handleFilterClicking(e) {
    if (e.target.tagName != "LABEL" || e.target.dataset.filter == document.querySelector("label:has(input:checked)").dataset.filter) return;

    extensionsContainer.innerHTML = ``;
    initState.allExtension.forEach(ext => {
        let isAllowed = e.target.dataset.filter == "all" || (e.target.dataset.filter == "active" && ext.isActive) || (e.target.dataset.filter == "inactive" && !ext.isActive)
        if (isAllowed) createExtension(ext);
    })
};

function handleKeyPressing(e, cond) {
    if (cond && (e.key == "Enter" || e.key == " ")) {
        e.preventDefault();
        e.target.click();
    }
};

