require('dotenv/config');
require('../../lib/db').init();
const admin = require('firebase-admin');
const test = require('ava');
const { createPost } = require('../../services/post');

const internals = {
    ids: []
}


test.after(t => {
    internals.ids.forEach(async id => {
        await admin.database().ref(`posts/${id}`).remove();
    });
});

test('Should post if the request is properly formed.', async t => {
    const res = await createPost({
        title: "Some title",
        author: "test",
        textBody: "This is some sample text that needs to be tested."
    });
    internals.ids.push(res.id);

    t.truthy(res);
    t.truthy(res.id);
});

test('Should fail if the title is not included.', async t => {
    try {
        const res = await createPost({
            author: "Joe Blows",
            textBody: "Home on the range. Where the deer and the antelope plaaaaay."
        });
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'child "title" fails because ["title" is required]');
    }
});

test('Should fail if the textBody is not included.', async t => {
    try {
        const res = await createPost({
            author: "Joe Blows",
            title: "This Is A Title"
        });
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'child "textBody" fails because ["textBody" is required]');
    }
});

test('Should fail if the author is not included.', async t => {
    try {
        const res = await createPost({
            textBody: "Home on the range. Where the deer and the antelope plaaaaay.",
            title: "This Is A Title"
        });
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'child "author" fails because ["author" is required]');
    }
});