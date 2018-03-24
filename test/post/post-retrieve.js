'use strict';
require('dotenv/config');
require('../../lib/db').init();
const admin = require('firebase-admin');
const test = require('ava');
const { getPostById, createPost } = require('../../services/post');


const internals = {
    ids: []
};

test.before(async () => {
    const resOne = await createPost({
        title: 'This Is A Title',
        author: 'Test Author',
        textBody: 'I blessed the rains down in Africaaaaa!'
    });

    internals.ids.push(resOne.id);
});

test.after(() => {
    internals.ids.forEach(async id => {
        await admin.database().ref(`posts/${id}`).remove();
    })
});

test('Should fail to retrieve with a bad Id.', async t => {
    try {
        await getPostById('GtHO54');
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'Id is not valid.');
    }
});

test('Should fail if a post with that ID doesn\'t exist.', async (t) => {
    try {
        await getPostById('HyT5eWq');
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'Could not find Post with ID: HyT5eWq');
    }
});

test('Should pass if the Id exists.', async (t) => {
    const res = await getPostById(internals.ids[0]);

    t.truthy(res.title);
    t.truthy(res.author);
    t.truthy(res.textBody);
    t.truthy(res.date);
});