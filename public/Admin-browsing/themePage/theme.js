const themeSelector = document.getElementById('themeSelector');
const customThemeForm = document.getElementById('customThemeForm');

// Synchronisation des couleurs du formulaire personnalisé
const colorInputs = {
    backgroundColor: document.getElementById('backgroundColor'),
    inputBackgroundColor: document.getElementById('inputBackgroundColor'),
    buttonBackgroundColor: document.getElementById('buttonBackgroundColor'),
    buttonHoverBackgroundColor: document.getElementById('buttonHoverBackgroundColor'),
    categoryBackgroundColor: document.getElementById('categoryBackgroundColor'),
    linkBackgroundColor: document.getElementById('linkBackgroundColor'),
    mainTextColor: document.getElementById('mainTextColor'),
    secondaryTextColor: document.getElementById('secondaryTextColor'),
    linkTextColor: document.getElementById('linkTextColor'),
    buttonTextColor: document.getElementById('buttonTextColor'),
    inputBorderColor: document.getElementById('inputBorderColor'),
    categoryBorderColor: document.getElementById('categoryBorderColor'),
    categoryShadowColor: document.getElementById('categoryShadowColor'),
    linkShadowColor: document.getElementById('linkShadowColor')
};

// Fonction pour appliquer les couleurs personnalisées à la page
function applyCustomTheme() {
    for (let key in colorInputs) {
        document.documentElement.style.setProperty(`--${key}`, colorInputs[key].value);
    }
}

// Ajouter un listener pour chaque champ de couleur dans le formulaire personnalisé
Object.keys(colorInputs).forEach(key => {
    colorInputs[key].addEventListener('input', applyCustomTheme);
});

// Gestion du menu de sélection de thème
themeSelector.addEventListener('change', (event) => {
    const selectedTheme = event.target.value;

    if (selectedTheme === 'light') {
        applyLightTheme();
        customThemeForm.style.display = "none";
    } else if (selectedTheme === 'dark') {
        applyDarkTheme();
        customThemeForm.style.display = "none";
    } else if (selectedTheme === 'custom') {
        customThemeForm.style.display = "block";
        applyCustomTheme(); // Applique les couleurs personnalisées si déjà changées
    }
});

// Thème clair
function applyLightTheme() {
    document.documentElement.style.setProperty('--background-color', '#e9ecef');
    document.documentElement.style.setProperty('--main-text-color', '#343a40');
    document.documentElement.style.setProperty('--category-background-color', '#ffffff');
    document.documentElement.style.setProperty('--button-background-color', '#007bff');
    document.documentElement.style.setProperty('--button-hover-background-color', '#0056b3');
}

// Thème sombre
function applyDarkTheme() {
    document.documentElement.style.setProperty('--background-color', '#121212');
    document.documentElement.style.setProperty('--main-text-color', '#ffffff');
    document.documentElement.style.setProperty('--category-background-color', '#2c2c2c');
    document.documentElement.style.setProperty('--button-background-color', '#bb86fc');
    document.documentElement.style.setProperty('--button-hover-background-color', '#3700b3');
}
