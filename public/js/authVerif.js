function checkAuthToken() {
    const userDropdown = document.getElementById('userDropdown');
    const dropdownMenu = userDropdown.nextElementSibling;

    // Vérifier si un token est stocké dans localStorage
    const authToken = localStorage.getItem('authToken');

    // Nettoyer le menu actuel pour ajouter les éléments appropriés
    dropdownMenu.innerHTML = '';

    if (authToken) {
        // L'utilisateur est connecté
        dropdownMenu.innerHTML = `
            <a class="dropdown-item" href="#">Profile</a>
            <a class="dropdown-item" href="#">Settings</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#" onclick="logout()">Logout</a>
        `;
        userDropdown.textContent = 'Username'; // Remplacer 'Username' par le nom de l'utilisateur si disponible
    } else {
        // Pas de token valide, l'utilisateur n'est pas connecté
        dropdownMenu.innerHTML = `
            <a class="dropdown-item" href="html/login.html">Login</a>
            <a class="dropdown-item" href="html/register.html">Create Account</a>
        `;
        userDropdown.textContent = 'Account';
    }
}

// Fonction pour gérer la déconnexion
function logout() {
    localStorage.removeItem('authToken');
    checkAuthToken(); // Re-vérifier le token après déconnexion pour mettre à jour l'interface
    alert('You have been logged out.'); // Informer l'utilisateur
}

// Appeler checkAuthToken au chargement de la page
window.onload = checkAuthToken;
