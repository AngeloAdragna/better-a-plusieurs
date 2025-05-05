import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Déterminer __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Récupérer l'adresse IP passée en argument ou utiliser 'localhost' par défaut
const ipAddress = process.argv[2]; // `localhost` par défaut
console.log(`Lancement des tests avec l'adresse IP : ${ipAddress}`);
const FRONT_DIR = resolve(__dirname, 'client');
const BACK_DIR = resolve(__dirname, 'server');

// Lancer le back (server) en spécifiant l'adresse IP
const backProcess = spawn('node', ['server.js', ipAddress], { cwd: BACK_DIR, stdio: 'inherit', shell: true });
backProcess.on('error', (err) => {
  console.error(`Erreur lors du lancement du backend : ${err.message}`);
});
// Lancer le front (client)
const frontProcess = spawn('npm', ['run', 'dev'], { cwd: FRONT_DIR, stdio: 'inherit', shell: true });
frontProcess.on('error', (err) => {
  console.error(`Erreur lors du lancement du frontend : ${err.message}`);
});


// Lancer les tests Cucumber après 2 secondes
const testProcess = spawn('npx', ['cucumber-js'], { cwd: BACK_DIR, stdio: 'inherit', shell: true });
testProcess.on('error', (err) => {
  console.error(`Erreur lors du lancement des tests : ${err.message}`);
}
);



const killAll = () => {
  frontProcess.kill();
  backProcess.kill();
  testProcess.kill();
  process.exit();
};

process.on('SIGINT', killAll);
process.on('SIGTERM', killAll);
