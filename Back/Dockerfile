# Utilisation de l'image officielle de Node.js
FROM node:16-alpine

# Créer un répertoire de travail
WORKDIR /home/node/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers de ton projet dans le conteneur
COPY . .

# Exposer le port du serveur
EXPOSE 3000

# Démarrer l'application en mode développement
CMD ["npm", "run", "dev"]
