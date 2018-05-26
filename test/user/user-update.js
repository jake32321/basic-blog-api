'use strict';
require('dotenv/config');
require('../../lib/db').init();
const admin = require('firebase-admin');
const test = require('ava');
const { createUser, getUserById, updateUser } = require('../../services/user');

const internals = {
    ids: []
};

test.before(async () => {
    const resOne = await createUser({
        disabled: false,
        displayName: 'Joe Blows',
        email: 'test-update@test.com',
        password: 'c00lPa$$',
        emailVerified: false
    });

    internals.ids.push(resOne.uid);
});

test.after(async () => {
    for (var id in internals.ids) {
        await admin.database().ref(`users/${internals.ids[id]}`).remove();
        await admin.auth().deleteUser(internals.ids[id]);
    }
});

test('Should fail to update the user when the ID does not exist.', async t => {
    try {
        await updateUser('abadid1232', {});
    } catch (err) {
        t.is(err.output.payload.statusCode, 404);
        t.is(err.output.payload.error, 'Not Found');
        t.is(err.output.payload.message, 'User with the ID: abadid1232, could not be found.');
    }
});

test('Should fail to update the user when a bad request is sent.', async t => {
    try {
        await updateUser(internals.ids[0], {
            abadkey: 'some bad data'
        });
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, '"abadkey" is not allowed');
    }
});

test(`Should be able to update a user's information.`, async t => {
    const {
        message,
        data: {
            displayName,
            email
        }
    } = await updateUser(internals.ids[0], {
        email: 'thisemail@gmail.com',
        displayName: 'ACoolName123'
    });

    t.is(message, `User: ${internals.ids[0]}, has been updated!`);
    t.is(displayName, 'ACoolName123');
    t.is(email, 'thisemail@gmail.com')
})