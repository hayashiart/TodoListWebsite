# Utilise une image Node.js comme base
# Rôle : Fournit l’environnement Node.js pour React
FROM node:18-alpine

# Définit le répertoire de travail
# Rôle : Crée un dossier /app dans le conteneur
WORKDIR /app

# Copie package.json et package-lock.json
# Rôle : Permet d’installer les dépendances
COPY package*.json ./

# Installe les dépendances
# Rôle : Installe les packages nécessaires
RUN npm install

# Copie le reste du code
# Rôle : Ajoute le code source de l’application
COPY . .

# Construit l’application
# Rôle : Génère le dossier build pour la production
RUN npm run build

# Installe un serveur pour servir l’application
# Rôle : Permet de servir les fichiers statiques
RUN npm install -g serve

# Expose le port 3000
# Rôle : Indique que l’application écoute sur le port 3000
EXPOSE 3000

# Commande pour démarrer l’application
# Rôle : Lance le serveur pour servir l’application
CMD ["serve", "-s", "build", "-l", "3000"]