'use strict';
require('dotenv/config');
require('../../lib/db').init();
const admin = require('firebase-admin');
const test = require('ava');
const { createUser, getUserById } = require('../../services/user');

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

test.after.always(async () => {
    internals.ids.forEach(async (id) => {
        admin.database().ref(`users/${id}`).remove();
        await admin.auth().deleteUser(id);
    });
});