'use strict';
require('dotenv/config');
require('../../lib/db').init();
const admin = require('firebase-admin');
const test = require('ava');
const { createUser, deleteUser } = require('../../services/user');

const internals = {
    ids: []
};

test.before(async (t) => {
    const resOne = await createUser({
        displayName: "James Dude",
	    password: "$omethIngC00l!",
	    email: "testhello@test.com"
    });

    internals.ids.push(resOne.uid);
});

test('Should be able to delete a user.', async (t) => {
    const res = await deleteUser(internals.ids[0]);
    
    t.truthy(res.message, `User with ID: ${internals.ids[0]}, has been deleted.`);
});

test('Should fail if a user with the given ID doesn\'t exist.', async (t) => {
    try {
        const res = await deleteUser('HybGft6T');
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'User with the ID: HybGft6T, does not exist.');
    }
});