import {Given, When, Then, Before} from "@cucumber/cucumber";
import request from "supertest";
import { expect } from "chai";
import {createUser, deleteUser, getUsers} from "../../db.js";
import app from "../../server.js";

let response;

// Clean up before running tests
Before(async function () {
    const users = await getUsers();
    const entries = Object.entries(users || {});
    console.log( "Cleaning up users before running tests" );
    for (const [id, user] of entries) {
        await deleteUser(id);
    }
});

Given('a user {string} with password {string}', async function (name, password) {
    const users = await getUsers();
    const entries = Object.entries(users || {});

    for (const [id, user] of entries) {
        if (user.name === name) {
            await deleteUser(id); // clean before creating
        }
    }

    await createUser({ name, password });
});

When('I POST to {string} with:', async function (endpoint, dataTable) {
    const data = dataTable.rowsHash();
    console.log("Sending POST request with body:", data); // Debug output (optional)
    response = await request(app).post(endpoint).send(data);
});

Then('the response status should be {int}', function (expectedStatus) {
    expect(response.status).to.equal(expectedStatus);
});

Then('the response should contain {string}: {word}', function (key, expectedValue) {
    const expected = expectedValue === 'true';
    expect(response.body).to.have.property(key, expected);
});
Then('the response should contain a token', function () {
    expect(response.body).to.have.property('token').that.is.a('string').and.is.not.empty;
});