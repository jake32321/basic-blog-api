'use strict';
require('dotenv/config');
require('../../lib/db').init();
const admin = require('firebase-admin');
const test = require('ava');
const { createUser, getUserById, deleteUser } = require('../../services/user');

const internals = {
    ids: []
};

test.before(async () => {
    const resOne = await createUser({
        disabled: false,
        displayName: 'Joe Blows',
        email: 'test1234@test.com',
        password: 'c00lPa$$',
        emailVerified: false
    });

    internals.ids.push(resOne.uid);
});

test.after.always(async () => {
    internals.ids.forEach(async (id) => {
        await admin.database().ref(`users/${id}`).remove();
        await admin.auth().deleteUser(id);
    });
});

test('Should fail to retrieve with a bad Id.', async (t) => {
    try {
        await getUserById('GtHO54');
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'Id is not valid.');
    }
});

test('Should fail if a post with that ID doesn\'t exist.', async (t) => {
    try {
        await getUserById('HyT5eWq');
    } catch (err) {
        t.is(err.output.payload.statusCode, 404);
        t.is(err.output.payload.error, 'Not Found');
        t.is(err.output.payload.message, 'User with the ID: HyT5eWq, does not exist.');
    }
});

test('Should pass if the Id exists.', async (t) => {
    const res = await getUserById(internals.ids[0]);

    t.is(res.displayName, 'Joe Blows');
    t.is(res.email, 'test1234@test.com');
});