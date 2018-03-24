require('dotenv/config');
require('../../lib/db').init();
const admin = require('firebase-admin');
const test = require('ava');
const { createUser } = require('../../services/user');

const internals = {
    ids: []
}

test.after(async t => {
    internals.ids.forEach(async id => {
        await admin.database().ref(`users/${id}`).remove();
    });

    // Not an ideal solution but works for testing purposes;
    await admin.auth().deleteUser(internals.ids[0]);
});

test('Should be able to create a user when request is formed correctly.', async t => {
    const result = await createUser({
        disabled: false,
        displayName: "Joe Blows",
        email: "test@test.com",
        password: "c00lPa$$",
        emailVerified: false
    });

    internals.ids.push(result.uid);

    t.truthy(result.uid);
    t.is(result.disabled, false);
    t.is(result.displayName, "Joe Blows");
    t.is(result.email, "test@test.com");
    t.is(result.emailVerified, false); 
});

test('Should fail if missing email.', async t => {
    try {
        const result = await createUser({
            disabled: false,
            displayName: "Joe Blows",
            password: "c00lPa$$",
            emailVerified: false
        });
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'child "email" fails because ["email" is required]');
    }
});

test('Should fail if missing password.', async t => {
    try {
        const result = await createUser({
            disabled: false,
            displayName: "Joe Blows",
            email: "test@test.com",
            emailVerified: false
        });
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'child "password" fails because ["password" is required]');
    }
});

test('Should fail if missing displayName.', async t => {
    try {
        const result = await createUser({
            disabled: false,
            email: "test@test.com",
            password: "c00lPa$$",
            emailVerified: false
        });
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'child "displayName" fails because ["displayName" is required]');
    }
});