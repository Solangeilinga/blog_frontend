# Blog App - Plateforme d'Orientation et Carrière

Ce projet est une application de blog moderne construite avec **Next.js**, axée sur l'accompagnement professionnel, la formation et les opportunités de carrière. Elle permet aux utilisateurs de consulter des articles à la une, des articles récents classés par catégories et de s'abonner à une newsletter.

## 🚀 Fonctionnalités

  * **Page d'accueil dynamique** : Présentation d'articles "À la une" et des publications les plus récentes.
  * **Navigation par catégories** : Sections dédiées à l'entrepreneuriat, l'orientation, le développement personnel, les compétences et les opportunités.
  * **Système d'Articles** : Affichage détaillé des articles avec temps de lecture, tags, likes et vues.
  * **Authentification** : Intégration d'un `AuthProvider` pour la gestion des sessions utilisateurs.
  * **Interface Responsive** : Design moderne utilisant Tailwind CSS et DaisyUI, optimisé pour tous les écrans.
  * **Composants réutilisables** : Sidebar, Navbar, Footer, Newsletter et cartes d'articles.

## 🛠️ Technologies utilisées

  * **Framework** : [Next.js 16.1.6](https://nextjs.org/) (App Router).
  * **Bibliothèque UI** : [React 19.2.3](https://react.dev/).
  * **Stylisation** : [Tailwind CSS 4.2.0](https://tailwindcss.com/) & [DaisyUI 5.5.18](https://daisyui.com/).
  * **Icônes** : [Lucide React](https://lucide.dev/).
  * **Langage** : [TypeScript](https://www.typescriptlang.org/).
  * **Gestion de données** : Fichiers JSON locaux pour les articles, auteurs et commentaires.

## 📦 Installation et Utilisation

### Prérequis

Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.

### Installation

1.  Clonez le dépôt :

    ```bash
    git clone https://github.com/votre-utilisateur/votre-repo.git
    cd votre-repo
    ```

2.  Installez les dépendances :

    ```bash
    npm install
    # ou
    yarn install
    ```

### Lancement du serveur de développement

Démarrez le projet localement :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) dans votre navigateur pour voir le résultat.

## 📂 Structure du Projet

  * `app/` : Contient les routes et les pages de l'application (Apropos, Carriere, Contact, etc.).
  * `components/` : Composants React réutilisables (Navbar, Sidebar, ArticleCard, etc.).
  * `public/data/` : Contient les données statiques du blog (articles.json, categories.json).
  * `public/assets/` : Images et ressources graphiques.

## 📝 Scripts disponibles

  * `npm run dev` : Lance l'application en mode développement.
  * `npm run build` : Prépare l'application pour la production.
  * `npm run start` : Lance l'application construite.
  * `npm run lint` : Exécute ESLint pour vérifier la qualité du code.


*Développé par Solange ILINGA - Étudiante en Bachelor of engineering.*
