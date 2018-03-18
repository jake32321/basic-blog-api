const dotenv = require('dotenv');
dotenv.config();
const { getPostById, createPost, deletePost } = require('../../services/post');
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
});

test.after(t => {
    internals.ids.forEach(id => {
        deletePost(id);
    })
})

test('Should fail to retrieve with a bad Id.', async t => {
    try {
        const res = await getPostById('GtHO54');
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, 'Id is not valid.');
    }
});

test(`Should fail if a post with that ID doesn't exist.`, async t => {
    try {
        const res = await getPostById('HyT5eWq');
    } catch (err) {
        t.is(err.output.payload.statusCode, 400);
        t.is(err.output.payload.error, 'Bad Request');
        t.is(err.output.payload.message, `Could not find Post with ID: HyT5eWq`);
    }
});

test('Should pass if the Id exists.', async t => {
    const res = await getPostById(internals.ids[0]);

    t.truthy(res.title);
    t.truthy(res.author);
    t.truthy(res.textBody);
    t.truthy(res.date);
});