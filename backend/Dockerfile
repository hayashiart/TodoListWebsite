# Utilise une image Node.js comme base
# Rôle : Fournit l’environnement Node.js pour Express
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

# Expose le port 5000
# Rôle : Indique que l’application écoute sur le port 5000
EXPOSE 5000

# Commande pour démarrer l’application
# Rôle : Lance le serveur Express
CMD ["node", "server.js"]