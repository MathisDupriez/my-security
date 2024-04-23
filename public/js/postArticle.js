// Sélection du formulaire dans le DOM
const form = document.querySelector('#articleForm');

// Écoute de l'événement de soumission du formulaire
form.addEventListener('submit', async (event) => {
    // Empêcher le comportement par défaut de soumission du formulaire
    event.preventDefault();

    // Récupération des valeurs des champs du formulaire
    const title = document.querySelector('#title').value;
    const content = document.querySelector('#content').value;
    const date = new Date(); // Vous pouvez ajuster la façon dont vous obtenez la date
    const likes = 0; // Par défaut, aucun "like" lors de la création
    const imagePath = document.querySelector('#imagePath').value;

    // Création d'un objet représentant les données du formulaire
    const formData = {
        title,
        content,
        date,
        likes,
        imagePath
    };

    try {
        // Envoi des données du formulaire au serveur
        const response = await fetch('/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData) // Conversion des données en format JSON
        });

        // Vérification de la réponse du serveur
        if (response.success) {
            // Affichage d'un message de succès si la soumission est réussie
            alert('Article soumis avec succès !');
            // Vous pouvez également rediriger l'utilisateur vers une autre page ou effectuer d'autres actions
        } else {
            // Affichage d'un message d'erreur si la soumission a échoué
            alert('Erreur lors de la soumission de l\'article.');
        }
    } catch (error) {
        // Gestion des erreurs en cas de problème avec la requête
        console.error('Une erreur s\'est produite :', error);
        alert('Une erreur s\'est produite lors de la soumission de l\'article.');
    }
});
