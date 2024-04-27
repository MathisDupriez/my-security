const importCheck = document.getElementById('importTheImage');
const choseCheck = document.getElementById('getExistingImage');
const imageList = document.getElementById('dropDownImageDiv');
const dropDownText = document.getElementById('dropDownText');
const imagePathName = document.getElementById('imagePathName');
const labelForImagePathName = document.getElementById('labelForImagePathName');
const submitBtn = document.getElementById('submitBtn');
const imagePreview = document.getElementById('imagePreview');


imagePreview.addEventListener('change', previewImage);

importCheck.addEventListener('change', handleChangeImportCheck);

choseCheck.addEventListener('change', handleChangeChoseCheck);


function handleChangeImportCheck() {
    if (this.checked) {
        choseCheck.checked = false;
        imagePathName.style.display = 'block';
        labelForImagePathName.style.display = 'block';
        labelForImagePathName.textContent = 'Nom du chemin de l\'image :';
    }else {
        choseCheck.checked = true;
        imagePathName.style.display = 'none';
        labelForImagePathName.style.display = 'none';
    }
}
function handleChangeChoseCheck() {
    if (this.checked) {
        importCheck.checked = false;
        imagePathName.style.display = 'none';
        labelForImagePathName.style.display = 'none';
    }else {
        importCheck.checked = true;
        imagePathName.style.display = 'block';
        labelForImagePathName.style.display = 'block';
        labelForImagePathName.textContent = 'Nom du chemin de l\'image :';
    }
}


// Gestion de la soumission des données
submitBtn.addEventListener('click', async () => {
    if(document.querySelector('#title').value === '' || document.querySelector('#content').value === '' || document.querySelector('#date').value === '' || document.querySelector('#likes').value === '') {
        alert('Veuillez remplir tous les champs.');
        return;
    }
    if(importCheck.checked && imagePathName.value === '') {
        alert('Veuillez entrer le nom du chemin de l\'image.');
        return;
    }
    if(choseCheck.checked && dropDownText.textContent === 'chemin de l\'image') {
        alert('Veuillez choisir une image.');
    }
    const formData = new FormData();
    formData.append('title', document.querySelector('#title').value);
    formData.append('content', document.querySelector('#content').value);
    formData.append('description', document.querySelector('#description').value);
    formData.append('date', document.querySelector('#date').value);
    formData.append('likes', document.querySelector('#likes').value);
    if(importCheck.checked) {
        formData.append('name', imagePathName.value);
        formData.append('image', document.querySelector('#image').files[0]);
    }
    if(choseCheck.checked) {
        formData.append('imagePath', dropDownText.textContent);
    }

    console.log('formData', formData);
    try {
        const response = await fetch('/articles', {
            method: 'POST',
            contentType: 'multipart/form-data',
            body: formData  // Pas besoin de définir le Content-Type ici, car FormData le fait automatiquement
        });
        const responseData = await response.json();
        if (responseData.success) {
            alert('Article soumis avec succès !');
            //document.getElementById('title').value = ''; // Réinitialisation des champs
            //document.getElementById('content').value = '';document.getElementById('date').value = '';
            //document.getElementById('likes').value = '';
            //document.getElementById('image').value = ''; // Réinitialisation du champ d'image
            //document.getElementById('imagePreview').src = '/image/no-image.png'; // Réinitialisation de l'aperçu
            //imagePathName.value = ''; // Réinitialisation du champ de nom de chemin d'image
            //dropDownText.textContent = 'chemin de l\'image'; // Réinitialisation du texte de la liste déroulante
            //choseCheck.checked = true;
        } else {
            alert('Erreur lors de la soumission de l\'article : ' + responseData.message);
        }
    } catch (error) {
        console.error('Une erreur s\'est produite :', error);
        alert('Une erreur s\'est produite lors de la soumission de l\'article.');
    }
});
async function fetchImages() {
    try {
        // Récupération des données d'image depuis le serveur
        const response = await fetch('/imagesPath');
        const images = await response.json();
        for (const image of images) {
            const option = document.createElement('option');
            option.value = image;
            option.textContent = image;
            option.addEventListener('click', function() {
                document.getElementById('imagePreview').src = image;
                dropDownText.textContent = image;
                console.log('dropDownText.textContent', dropDownText.textContent);
            });
            imageList.appendChild(option);
        }
    } catch (error) {
        console.error('Failed to fetch images:', error);
        // Vous pouvez également ajouter un message ou une action d'erreur pour l'utilisateur ici
    }
}

// Fonction pour afficher l'aperçu de l'image chargée
function previewImage() {
    const file = document.querySelector('#image').files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        document.getElementById('imagePreview').src = e.target.result;
        document.getElementById('imagePreview').style.display = 'block';
    };
    if (file) {
        reader.readAsDataURL(file);
    }
}
fetchImages();
choseCheck.checked = false;
importCheck.checked = true;
importCheck.change();