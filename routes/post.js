const express = require('express');
const post = require('../services/post');
const router = require('express').Router();

router.get('/', async (req, res) => {
    await post.getPosts().then(result => {
        res.send(result);
    });
});

router.post('/', (req, res) => {
    const postRes = post.createPost(req.body);
    res.send(postRes);
});

router.get('/:id', async (req, res) => {
    await post.getPostById(req).then(result => {
        res.send(result);
    })
});

router.put('/:id', async (req, res) => {
    const postUpdateRes = await post.updatePost(req.body);
    res.send(postUpdateRes);
});

module.exports = router;