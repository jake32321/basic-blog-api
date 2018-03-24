'use strict';
require('dotenv/config');
require('../../lib/db').init();
const admin = require('firebase-admin');
const test = require('ava');
const { updatePost, createPost } = require('../../services/post');

const internals = {
    ids: []
};

test.before(async () => {
    const reqOne = await createPost({
        title: 'This Is A Title',
        author: 'Test Author',
        textBody: 'I blessed the rains down in Africaaaaa!'
    });

    internals.ids.push(reqOne.id);

    const reqTwo = await createPost({
        title: 'This Is A Title 2',
        author: 'Test Author 2',
        textBody: 'I blessed the rains down in Africaaaaa! 2'
    });

    internals.ids.push(reqTwo.id);

    const reqThree = await createPost({
        title: 'This Is A Title 2',
        author: 'Test Author 2',
        textBody: 'I blessed the rains down in Africaaaaa! 2'
    });

    internals.ids.push(reqThree.id);
});

test.after(() => {
    internals.ids.forEach(async (id) => {
        await admin.database().ref(`posts/${id}`).remove();
    });
});

test('Should pass without title and author', async (t) => {
    const req = {
        textBody: 'This is the story about...'
    }

    const res = await updatePost(req, internals.ids[0]);

    t.truthy(res.title);
    t.truthy(res.author);
    t.truthy(res.date);
    t.is(res.textBody, 'This is the story about...');
});

test('Should pass without textBody and author', async (t) => {
    const req = {
        title: 'The Title'
    }

    const res = await updatePost(req, internals.ids[0]);

    t.truthy(res.textBody);
    t.truthy(res.author);
    t.truthy(res.date);
    t.is(res.title, 'The Title');
});

test('Should pass without anything in the request', async (t) => {
    const req = {}

    const res = await updatePost(req, internals.ids[2]);
    t.truthy(res);
});

test('Should fail with a bad Id', async (t) => {
    const req = {}

    try {
        await updatePost(req, 'Gt54');
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'Id is not valid.');
    }
});

test('Should fail if a post with that ID doesn\'t exist.', async (t) => {
    const req = {}

    try {
        await updatePost(req, 'HyT5eWq');
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'Could not find Post with ID: HyT5eWq');
    }
});

test('Should fail if a post is poorly formed.', async (t) => {
    const req = {
        garbo: 'bad prop'
    }

    try {
        await updatePost(req, internals.ids[1]);
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'Request poorly formed.');
    }
});