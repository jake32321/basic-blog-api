const dotenv = require('dotenv');
dotenv.config();
const { getPosts } = require('../../services/post');
const db = require('../../lib/db');
const test = require('ava');

test('Should be able to get all the posts.', async t => {
    const res = await getPosts();

    t.truthy(res);
})