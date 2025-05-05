import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import request from "supertest";
import { expect } from "chai";
import { createUser, deleteUser, getUsers } from "../../db.js";
import app from "../../server.js";
import puppeteer from 'puppeteer';

let browser;
let page;
let response;

// Clean up users before tests
Before(async function () {
    const users = await getUsers();
    const entries = Object.entries(users || {});
    console.log("Cleaning up users before running tests");
    for (const [id, user] of entries) {
        //await deleteUser(id);
    }
});

// Launch browser before tests
Before(async function () {
    let chromePath;

    // Vérifier le système d'exploitation
    if (process.platform === 'win32') {
        // Pour Windows
        chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'; // Chemin de Chrome sur Windows
        console.log(`Using Chrome on Windows: ${chromePath}`);
    } else if (process.platform === 'linux') {
        // Pour Linux
        chromePath = '/usr/bin/chromium-browser'; // Chemin de Chromium sur Linux
        console.log(`Using Chromium on Linux: ${chromePath}`);
    } else if (process.platform === 'darwin') {
        // Pour macOS
        chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'; // Chemin de Chrome sur macOS
        console.log(`Using Chrome on macOS: ${chromePath}`);
    } else {
        throw new Error(`Unsupported platform: ${process.platform}`);
    }

    // Lancer le navigateur avec le chemin fixe
    browser = await puppeteer.launch({
        headless: false,
        slowMo: 40,
        executablePath: chromePath,
        timeout: 10000 // 10 secondes
    });

    page = await browser.newPage();
});

// Close browser after tests
After(async function () {
    if (browser) {
        console.log('Closing browser...');
        await browser.close();
    }
});

// User setup
Given('a user {string} with password {string}', async function (name, password) {
    const users = await getUsers();
    const entries = Object.entries(users || {});
    for (const [id, user] of entries) {
        if (user.name === name) {
            await deleteUser(id);
        }
    }
    await createUser({ name, password });
});

// Sending a POST request
When('I POST to {string} with:', async function (endpoint, dataTable) {
    const data = dataTable.rowsHash();
    console.log("Sending POST request with body:", data);
    response = await request(app).post(endpoint).send(data);
});

// Checking response status
Then('the response status should be {int}', function (expectedStatus) {
    expect(response.status).to.equal(expectedStatus);
});

// Checking response contains a certain value
Then('the response should contain {string}: {word}', function (key, expectedValue) {
    const expected = expectedValue === 'true';
    expect(response.body).to.have.property(key, expected);
});

// Checking for a token
Then('the response should contain a token', function () {
    expect(response.body).to.have.property('token').that.is.a('string').and.is.not.empty;
});

//
// === NOUVELLES ÉTAPES WEB ===
//

// Naviguer vers la page de connexion
Given('I am on the home page', async function () {
    await page.goto('http://localhost:5173');  // change l'URL selon ton app
});

When('I click on the login button', async function () {
  // Attendre qu'un élément spécifique de la page soit visible avant de continuer
  await page.waitForSelector('#btn_login');  // attend que le bouton de connexion soit visible
  await page.click('#btn_login');
});
When('I click on the create room button', async function () {
  // Attendre qu'un élément spécifique de la page soit visible avant de continuer
  await page.waitForSelector('#btn_createroom');  // attend que le bouton de connexion soit visible
  await page.click('#btn_createroom');
});



// Remplir les champs de connexion
When('I fill in username {string} and password {string}', async function (username, password) {
    await page.type('#username', username);  // adapte les sélecteurs
    await page.type('#password', password);
});

// Cliquer sur le bouton de connexion
When('I click the submit button', async function () {
    await page.click('#submit');  // adapte le sélecteur
});

Then('I should see the user {string} connected', async function (username) {    
    await page.waitForSelector('#connected-info', { visible: true });
    const connectedInfo = await page.$eval('#connected-info', el => el.textContent.trim());
    const expectedText = `Connecté en tant que ${username}`;
    expect(connectedInfo).to.equal(expectedText);
});


Then("I should see an error message when i submit", async function () {
    const errorMessagePromise = new Promise(resolve => {
        page.once('dialog', async dialog => {
            const message = dialog.message();
            await dialog.dismiss();
            resolve(message);
        });
    });

    await page.click('#submit');
    const errorMessage = await errorMessagePromise;
    expect(errorMessage).to.equal('Erreur de connexion : undefined');
});

// create room
When('I fill in the room name with {string}', async function (roomName) {
    await page.type('#roomName', roomName);
});

When('I check the last checkbox', async function () {
    // Attendre que la case à cocher soit visible avant de cliquer dessus
    await page.waitForSelector('#check_share', { visible: true });
    await page.click('#check_share');
});


// Remplir le champ de recherche
When('I fill in the searchbar with {string}', async function (search) {
    await page.type('#input_searchbar', search);  // adapte le sélecteur
});

// Cliquer sur le bouton de recherche de vidéo
When('I click the searchbar button', async function () {
    await page.click('#btn_searchIconBar');  // adapte le sélecteur
});

When('I click on the button number {int} to add video to the playlist', async function (index) {
    await page.waitForSelector('#searchResultsModal.open');
    const buttons = await page.$$('.add-to-playlist');
    if (index < 1 || index > buttons.length) {
        throw new Error(`Invalid button index: ${index}`);
    }
    await buttons[index - 1].click();
});

When('I select the video number {int}', async function (index) {
    // Wait for the modal to be open and ensure the video selectors are available
    await page.waitForSelector('#searchResultsModal.open');
    
    // Wait for the video selector elements to be available
    const buttons = await page.$$('.video-selector');
    
    // Validate the index to make sure it's within range
    if (index < 1 || index > buttons.length) {
        throw new Error(`Invalid button index: ${index}. Only ${buttons.length} videos available.`);
    }
    
    // Wait for the button to be clickable before clicking it
    const buttonToClick = buttons[index - 1];
    await page.waitForSelector('.video-selector');
    await buttonToClick.click();
});

When('I launch the video', async function () {
    await page.click('#video');  // adapte le sélecteur
});

When('I click on the skip button', async function () {
    await page.click('#skip_video_btn');  // adapte le sélecteur
});


When('I click on close button', async function () {
    await page.click('#closeResultsModal');  // adapte le sélecteur
});

When('I display the playlist', async function () {
    await page.click('#display_playlist');  // adapte le sélecteur
}); 

When('I display the history', async function () {
    await page.click('#display_history');  // adapte le sélecteur
});

When('I wait for {int} seconds', async function (seconds) {
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));  // attends le nombre de secondes spécifié
});