# Tune Collector

Application web de collection de cartes musicales. Les joueurs ouvrent des paquets,
collectionnent des cartes, les vendent ou les échangent.


## Avancement

| Ticket | Fonctionnalité | État |
|---|---|---|
| MVP-01 | Créer un compte | Terminé |


## Technologies

- **Frontend** : Vue.js 3 + Vite
- **Backend** : Node.js + Express
- **Stockage** : fichiers JSON (`backend/data/`)

## Installation

Prérequis : [Node.js](https://nodejs.org) 18 ou plus récent.

```bash
git clone <url-du-depot>
cd Tune_Collector_ProjetDev2

cd backend
npm install

cd ../frontend
npm install
```

## Lancer l'application

Il faut deux terminaux ouverts en même temps.

**Terminal 1 : backend** (API sur http://localhost:3000)
```bash
cd backend
npm run dev
```

**Terminal 2 : frontend** (application sur http://localhost:5173)
```bash
cd frontend
npm run dev
```

Ouvre ensuite **http://localhost:5173** dans le navigateur. Le frontend redirige
automatiquement les appels `/api` vers le backend.

## Structure du projet

```
backend/
  data/           Fichiers JSON (users.json, ...)
  src/
    routes/       Routes de l'API
    middlewares/  Validation des données reçues
    repositories/ Lecture et écriture des fichiers JSON
    utils/        Hachage des mots de passe, verrou d'écriture
    app.js        Configuration d'Express
    server.js     Démarrage du serveur
frontend/
  src/
    components/   Composants réutilisables (en-tête, pied de page, logo)
    views/        Pages (inscription, ...)
    assets/       Styles globaux
```

## MVP-01 : Créer un compte

Un visiteur crée un compte avec un **pseudo** et un **mot de passe**.
L'email n'est pas utilisé : la connexion se fera avec le pseudo.

### Règles
- **Pseudo** : requis, 3 à 20 caractères (lettres, chiffres, `_`, `-`, `.`),
  unique (la casse est ignorée : `MC_Collector` et `mc_collector` sont le même pseudo).
- **Mot de passe** : requis, 8 à 128 caractères, à confirmer dans le formulaire.
- Le mot de passe est stocké **haché** (scrypt avec un sel aléatoire), jamais en clair.
- Les comptes sont sauvegardés dans `backend/data/users.json`.
- Les écritures dans le JSON se font une à la fois, via un fichier temporaire
  remplacé d'un coup, pour éviter les doublons et les fichiers corrompus.

### Route API

`POST /api/auth/register`

Requête :
```json
{ "username": "MC_Collector", "password": "motdepasse1" }
```

| Code | Signification | Corps de la réponse |
|---|---|---|
| 201 | Compte créé | `{ "id": "...", "username": "MC_Collector" }` |
| 400 | Données invalides | `{ "error": "Données invalides.", "fields": { "username": "...", "password": "..." } }` |
| 409 | Pseudo déjà pris | `{ "error": "Ce pseudo est déjà pris." }` |

Exemple pour créer un utilisateur via PowerShell (Windows) :
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/register -ContentType "application/json" -Body '{"username":"MC_Collector","password":"motdepasse1"}'
```

### Format d'un compte dans `users.json`

```json
{
  "id": "6f1c0b0e-...",
  "username": "MC_Collector",
  "passwordHash": "scrypt$<sel>$<hash>",
  "credits": 0,
  "packs": 10,
  "lastPackAt": "2026-11-17T12:00:00.000Z",
  "createdAt": "2026-11-17T12:00:00.000Z"
}
```

Un nouveau compte démarre avec 0 crédit et 10 paquets. `lastPackAt` servira à calculer
la distribution d'un paquet toutes les 10 minutes.

### Tester à la main
1. Crée un compte depuis le formulaire : un message vert s'affiche et le compte
   apparaît dans `backend/data/users.json`.
2. Recrée un compte avec le même pseudo : « Ce pseudo est déjà pris. »
3. Envoie un formulaire vide ou un mot de passe trop court : les erreurs
   apparaissent sous les champs concernés.