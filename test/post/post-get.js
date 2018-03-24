'use strict';
require('dotenv/config');
require('../../lib/db').init();
const test = require('ava');
const { getPosts } = require('../../services/post');

test('Should be able to get all the posts.', async (t) => {
    const res = await getPosts();

    t.truthy(res);
});