'use strict';
const post = require('../services/post');
const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const result = await post.getPosts();
        res.send(result);
    } catch (err) {
        res.send(err.output.payload);
    }
});

router.post('/', async (req, res) => {
    try {
        const result = await post.createPost(req.body);
        res.send(result);
    } catch (err) {
        res.send(err.output.payload);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await post.getPostById(req.params.id);
        res.send(result);
    } catch (err) {
        res.send(err.output.payload);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const result = await post.updatePost(req.body, req.params.id);
        res.send(result);
    } catch (err) {
        res.send(err.output.payload);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await post.deletePost(req.params.id);
        res.send(result);
    } catch (err) {
        res.send(err.output.payload);
    } 
});

module.exports = router;