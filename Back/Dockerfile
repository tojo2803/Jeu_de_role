
# Étape 1 : Utiliser l’image officielle Node.js
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste des fichiers
COPY . .

# Exposer le port utilisé par l’application
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "server.js"]
