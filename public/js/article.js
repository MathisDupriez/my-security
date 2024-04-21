// Your markdown content
const markdownContent = `
### **On commence par des commande simples de vérifications des connexions**
#### on commence par un last qui nous donne la liste de toute les connexion avec les ips.
\`\`\`bash
last
\`\`\`
#### Ensuite on va vérifier les sessions ouvertes.
\`\`\`bash
who

# ou alors pour avoir plus de détails 

w 

# (oui simplement la lettre 'w')
\`\`\`

#### Que faire si on voit une connexion que l'on ne reconnais pas ? 
\`\`\`bash
# on prélève l'addresse ip et on vérifier 

whois <ip> 
\`\`\`
> Cette commande va vous donner tout un tas d'information des base de donnée RIPE qui vont vous fournir le providers de cette ip, le pays, etc. 
> Si vous ne reconnaissais ni l'heure ni le providers, renseigner vous vite et bloqué la sessions. 
\`\`\`bash
# on va interdir la connexion de cette ip. Ne faites pas cette commande de façon trop attives, vérifier d'abord de quoi il s'agit. Pour ne pas vous bloquez vous même. 

# Pour ce faire on va utiliser notre parefeu UFW 

sudo ufw deny from <adresse_IP>

\`\`\`
# Sur le serveur
>Le sudo n'est écrit uniquement que pour précisé que ces commande nécessite des droits, si vous êtes en root ou connecté avec un user ayant étant dans le groupe sudo, le sudo n'est pas nécessaire.
### **Créer un nouvel utilisateur :**
\`\`\`bash
sudo adduser nouveau_utilisateur
\`\`\`

### **Ajouter l'utilisateur au groupe sudo (si nécessaire) :**
\`\`\`bash
# ne jamais faire ca pour l'utilisateur que l'on va utiliser pour le service ssh
sudo usermod -aG sudo nouveau_utilisateur
\`\`\`

### **Configurer la connexion SSH avec l'utilisateur :**
\`\`\`bash
sudo nano /etc/ssh/sshd_config
\`\`\`

 Modifiez les paramètres suivants :
 
\`\`\`c
PermitRootLogin no
PasswordAuthentication no
\`\`\`

### **Changer le port SSH (remplacez '2222' par le port de votre choix) :**
\`\`\`c
Port 2222
\`\`\`

### **Redémarrez le service SSH pour appliquer les changements :**
\`\`\`bash
sudo systemctl restart ssh
\`\`\`
> Maintenant quand vous vous connectez vous devez utilisé le port que vous avez choisis
# Sur le pc
### **Générer une paire de clés SSH sur votre machine locale (si ce n'est pas déjà fait) :**
\`\`\`bash
ssh-keygen -t rsa -b 4096
\`\`\`

### **Copiez la clé publique sur le serveur :**
\`\`\`
ssh-copy-id -p 2222 nouveau_utilisateur@adresse_ip_du_serveur
\`\`\`
>Ici dans un premier temps, vous tester la possibilité de ce connecté avec la clef générer avec l'utilisateur choisis, si c'est bien le cas vous pouvez passez à la suite
# Sur le serveur
### **Désactivez la connexion en tant que root (assurez-vous de pouvoir vous connecter en tant que nouvel utilisateur avant de faire cela) :**
\`\`\`bash
sudo nano /etc/ssh/sshd_config
\`\`\`

Modifiez :
\`\`\`c
PermitRootLogin no
\`\`\`

### **Redémarrez le service SSH à nouveau :**
\`\`\`bash
sudo systemctl restart ssh
\`\`\`
`;
// Convert markdown to HTML and display
document.getElementById('articleContent').innerHTML = marked.parse(markdownContent);
document.querySelectorAll('code').forEach((block) => {
    hljs.highlightBlock(block);
});