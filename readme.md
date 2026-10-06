## Better à plusieurs — synthèse

**Ce que c'est** : une web-app de *watch party* YouTube. Plusieurs personnes rejoignent une « room », cherchent des vidéos YouTube, les ajoutent à une playlist partagée et les regardent en lecture synchronisée, avec chat et système de votes. Visiblement un projet étudiant/de groupe (readme dupliqué, clés en dur, pas de CI de tests).

### Architecture

Deux applications Node séparées, lancées à la main :

| | Stack | Rôle |
|---|---|---|
| `client/` | React 19 + Vite, React Router, Materialize CSS, socket.io-client, react-youtube, tsparticles, Swiper | ~2 350 lignes de JSX, 24 composants |
| `server/` | Express 4 + Socket.IO 4, Firebase Realtime Database (SDK admin), JWT, bcrypt déclaré | ~750 lignes, API REST + hub temps réel sur le port 8080 |

Particularité notable : au démarrage, `server.js` exige une IP en argument (`node server.js 192.168.1.42`) et **écrit lui-même le fichier `client/.env`** avec `VITE_SERVER_IP`. C'est astucieux pour une démo en LAN, mais ça couple le back au front au niveau du système de fichiers.

### Modèle de domaine

Côté serveur, tout est **en mémoire** : un `RoomManager` statique contient un tableau de `Room` (classe avec champs privés `#id`, `#videoPlaylist`, `#videoHistory`, `#currentVoteInfos`). Seuls les utilisateurs sont persistés, dans Firebase RTDB. Conséquence : un redémarrage du serveur efface toutes les rooms, et aucune room n'est jamais supprimée du tableau (fuite mémoire lente).

### Fonctionnalités

- **Auth** : inscription/connexion maison (hash SHA-256 du mot de passe, pas bcrypt malgré la dépendance), JWT signé, plus un OAuth Google séparé pour lire les abonnements YouTube de l'utilisateur et proposer des recommandations.
- **Rooms** : création avec paramètres (nom, room publique/privée, `voteSkip`, `votePlay`), liste des rooms publiques, partage par lien + QR code, modification des paramètres diffusée en temps réel.
- **Recherche YouTube** : API Data v3 côté client ; les suggestions passent par un proxy `/suggest` côté serveur (qui parse la réponse `window.google.ac.h(...)` de Google — contournement CORS).
- **Lecture synchronisée** : events `play` / `pause` / `sync` toutes les 2 s avec tolérance de 2 s de dérive. Le passage à la vidéo suivante attend que *tous* les clients aient signalé `videoEnded` (compteur `videoEndedCounter`).
- **Votes** : vote « ajouter » ou « passer », fenêtre fixe de 15 s via `setTimeout`, majorité calculée sur les votes exprimés.
- **Chat** : messages temps réel, emoji-mart, GIFs Giphy, sons join/leave, zone de notifications.
- **Tests** : Cucumber + Puppeteer, un seul `login.feature` qui joue un scénario end-to-end assez long (connexion → création de room → recherche → playlist → skip → historique). Un script `runner_tests.js` lance back, front et tests en parallèle.

### Points de fragilité

Le plus urgent : **la clé de service Firebase complète (`token/token.json`, avec `private_key`) est commitée dans le dépôt**, ainsi que la clé API YouTube en dur dans `YoutubeSearchBar.jsx` et un `secret_key = "secret_key"` pour signer les JWT. Si le dépôt a été public ne serait-ce qu'un moment, ces trois secrets sont à révoquer et régénérer.

Ensuite, sur le plan conception :
- le middleware `authenticateToken` existe mais **n'est utilisé sur aucune route** — `/create-room`, `/room/:id`, `DELETE /users/:id` sont ouverts à tous ;
- aucune autorisation sur les events socket : n'importe quel client connaissant un `roomId` peut changer les paramètres de la room, voter plusieurs fois (`vote()` ne vérifie pas qui vote), ou forcer `nextVideo` ;
- la classe `Client` est vide, `ownerClient` ne stocke qu'un nom d'utilisateur ;
- `endVote(id)` ignore son paramètre, donc deux votes concurrents peuvent se marcher dessus ;
- dépendances dupliquées entre le `package.json` racine, `client/` et `server/`.

C'est un projet fonctionnellement riche et plutôt bien découpé côté React ; la dette est concentrée sur la sécurité et la persistance.

### Installation des dépendances

Dans le dossier `client`, exécuter la commande suivante :

```sh
cd client
npm install
```

### Lancement du projet

#### Démarrer le serveur

Ouvrir un premier terminal et exécuter :

```sh
cd server
node server.js
```

#### Démarrer le client

Dans un second terminal, exécuter les commandes suivantes :

```sh
cd client
npm run dev
```

### 3. Accès à l'application

Ouvrir un navigateur et se rendre à l'adresse :

```
http://localhost:5173
```

=======

### Installation des dépendances

Dans le dossier `client`, exécuter la commande suivante :

```sh
cd client
npm install
```

### Lancement du projet

#### Démarrer le serveur

Ouvrir un premier terminal et exécuter :

```sh
cd server
node server.js
```

#### Démarrer le client

Dans un second terminal, exécuter les commandes suivantes :

```sh
cd client
npm run dev
```

### 3. Accès à l'application

Ouvrir un navigateur et se rendre à l'adresse :

```
http://localhost:5173
```

### Effectuer les tests

Depuis la racine du projet `/better-a-plusieurs`

```sh
node runner_tests.js "votre adresse ip"
```
http://localhost:5173  

### Exécuter les tests : 
Attention il faut que google chrome soit installé pour que puppeteer fonctionne et que les tests passent !
Il faut également lancer une première fois le server et le client afin de remplir la variable d'environnement !  
```sh
cd client
npm run dev
cd../server
npx cucumber-js
```
