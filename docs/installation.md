
# Installer et démarrer Tune Collector

Ce guide explique comment récupérer le projet depuis GitHub, installer ses dépendances et démarrer le frontend et le backend.

## Prérequis

Installer les outils suivants :

- Node.js 20 ou supérieur, qui inclut npm ;
- Git ;
- un navigateur récent : Chrome, Firefox ou Edge.

Vérifier les installations :

```bash
node --version
npm --version
git --version
```

## Récupérer le projet

Dans un terminal :

```bash
git clone <URL_DU_DEPOT_GITHUB>
cd <NOM_DU_DEPOT>
```

Remplacer les valeurs entre chevrons par celles du dépôt GitHub de l’équipe.

## Installer le backend

Ouvrir un premier terminal à la racine du projet :

```bash
cd backend
npm install
copy .env.example .env
```

Sous macOS ou Linux, remplacer la commande `copy` par :

```bash
cp .env.example .env
```

Le fichier `backend/.env` doit contenir au minimum :

```env
PORT=3000
HOST=0.0.0.0
TOKEN_SECRET=remplacer-par-une-cle-longue-et-aleatoire
```

Le fichier `.env` est personnel à chaque développeur et ne doit jamais être envoyé sur GitHub.

## Démarrer le backend

Depuis le dossier `backend` :

```bash
npm run dev
```

Le script `dev` doit démarrer le fichier `src/server.js`. Une fois lancé, le backend doit être accessible sur `http://localhost:3000`.

## Installer et démarrer le frontend

Ouvrir un second terminal à la racine du projet :

```bash
cd frontend
npm install
npm run dev
```

Vite affiche l’adresse du frontend dans le terminal, habituellement `http://localhost:5173`.

## Vérifier l’installation

1. Ouvrir l’adresse affichée par Vite dans le navigateur.
2. Vérifier que la page d’accueil apparaît.
3. Vérifier que le frontend peut appeler le backend.
4. Créer un compte de test lorsque l’authentification est disponible.
5. Vérifier que les fichiers du dossier `backend/data/` sont modifiés après une action de jeu.

## Accès depuis le réseau local

Le PC qui démarre les services devient le serveur local.

1. Relever son adresse IPv4 avec `ipconfig` sous Windows.
2. Autoriser les ports nécessaires dans le pare-feu uniquement pour le réseau privé.
3. Démarrer le backend avec `HOST=0.0.0.0`.
4. Démarrer Vite avec l’option d’accès réseau si nécessaire : `npm run dev -- --host 0.0.0.0`.
5. Depuis un autre appareil connecté au même réseau, ouvrir l’adresse affichée par Vite, par exemple `http://192.168.1.25:5173`.

Le projet est réservé au réseau local : ne pas créer de redirection de port vers Internet.

## Arrêter les serveurs

Dans chaque terminal, utiliser `Ctrl + C`. Les données restent conservées dans les fichiers JSON du dossier `backend/data/`.
