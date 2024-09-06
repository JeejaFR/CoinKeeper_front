# Application de Suivi des Dépenses - Frontend

## Description

Ce projet est une application web permettant de suivre les dépenses quotidiennes ou mensuelles. L'utilisateur peut ajouter des transactions, les classer par catégorie, et consulter un récapitulatif sous forme de liste ou de graphiques. 

## Technologies Utilisées

- **Frontend** : Vue.js, Vuetify, Vue Router, pinia
- **Graphiques** : Chart.js
- **Style** : CSS (scoped), Vuetify pour les composants UI

## Installation

### Prérequis

Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.

### Cloner le dépôt

```bash
git clone https://github.com/JeejaFR/CoinKeeper_front
cd frontend
```

### Installer les dépendances

```bash
npm install
```

### Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet avec la variable suivante :

```dotenv
VITE_BACKEND_URL=http://localhost:2000
```

Remplacez la valeur par l'adresse de votre serveur back.

### Lancer le projet en développement

```bash
npm run dev
```

Le projet sera accessible à [http://localhost:3000](http://localhost:3000).

## Structure du Projet

- `src/`
  - `assets/` : Contient les images et autres ressources statiques.
  - `components/` : Composants Vue réutilisables.
  - `pages/` : Pages principales de l'application
  - `router/` : Configuration des routes Vue Router.
  - `services/` : Configuration des appels API.
  - `store/` : Gestion de l'état global avec pinia.
  - `App.vue` : Composant racine de l'application.
  - `main.js` : Point d'entrée de l'application.
- `public/` : Contient les fichiers statiques accessibles directement.

## Fonctionnalités

1. **Gestion des utilisateurs** :
   - Inscription et connexion sécurisées.
   - Gestion de la session utilisateur.

2. **Ajout et gestion des transactions** :
   - Formulaire pour ajouter des transactions avec validation.
   - Affichage et gestion des transactions : liste, tri, filtrage, modification, suppression.

3. **Récapitulatif des dépenses** :
   - Affichage du total des dépenses et récapitulatif par catégorie.
   - Graphiques pour visualiser les dépenses.

4. **Interface Utilisateur** :
   - Design responsive pour mobile, tablette et desktop.
   - Interface intuitive avec Vuetify.


## Déploiement

Pour construire la version production de l'application :

```bash
npm run build
```

Les fichiers construits seront disponibles dans le répertoire `dist/`.


## Documentation

Pour plus de détails sur l'utilisation de l'application, veuillez consulter [la documentation utilisateur](./docs/user-guide.md) et [la documentation technique](./docs/technical-guide.md).

## Licence

Ce projet est sous la licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus d'informations.