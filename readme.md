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
