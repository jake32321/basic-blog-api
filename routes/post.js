const express = require('express');
const post = require('../services/post');
const router = require('express').Router();

router.get('/', async (req, res) => {
    try{
        await post.getPosts().then(result => {
            res.send(result);
        });
    } catch(err) {
        res.send(err.output.payload);
    }
});

router.post('/', (req, res) => {
    try {
        const postRes = post.createPost(req.body);
        res.send(postRes);
    } catch(err) {
        res.send(err.output.payload);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await post.getPostById(req);
        res.send(result);
    } catch(err) {
        res.send(err.output.payload);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const postUpdateRes = await post.updatePost(req.body, req.params.id);
        res.send(postUpdateRes);
    } catch(err) {
        res.send(err.output.payload);
    }
});

module.exports = router;