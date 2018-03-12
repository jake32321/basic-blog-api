const dotenv = require('dotenv');
dotenv.config();
const { updatePost, createPost } = require('../../services/post');
const db = require('../../lib/db');
const test = require('ava');

const internals = {
    ids: []
}

test.before(t => {
    const resOne = createPost({
        title: "This Is A Title",
        author: "Test Author",
        textBody: "I blessed the rains down in Africaaaaa!"
    });

    internals.ids.push(resOne.id);

    const resTwo = createPost({
        title: "This Is A Title 2",
        author: "Test Author 2",
        textBody: "I blessed the rains down in Africaaaaa! 2"
    });

    internals.ids.push(resTwo.id);

    const resThree = createPost({
        title: "This Is A Title 2",
        author: "Test Author 2",
        textBody: "I blessed the rains down in Africaaaaa! 2"
    });

    internals.ids.push(resThree.id);
});

test('Should pass without title and author', async t => {
    const req = {
        textBody: "This is the story about..."
    }

    const res = await updatePost(req, internals.ids[0]);
    t.truthy(res.title);
    t.truthy(res.author);
    t.truthy(res.date);
    t.is(res.textBody, 'This is the story about...');
});

test('Should pass without textBody and author', async t => {
    const req = {
        title: "The Title"
    }

    const res = await updatePost(req, internals.ids[0]);
    t.truthy(res.textBody);
    t.truthy(res.author);
    t.truthy(res.date);
    t.is(res.title, 'The Title');
});

test('Should pass without anything in the request', async t => {
    const req = {}

    const res = await updatePost(req, internals.ids[2]);
    t.truthy(res);
});