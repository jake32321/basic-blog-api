const express = require('express');
const Joi = require('joi');
const Boom = require('boom');
const post = require('../services/post');
const router = require('express').Router();

router.get('/', async (req, res) => {
    await post.getPosts().then(result => {
        res.send(result);
    })
});

router.get('/:id', async (req, res) => {
    await post.getPostById(req).then(result => {
        res.send(result);
    })
});

router.post('/', (req, res) => {
    const result = Joi.validate(req.body, post.postSchema);

    if(result.error === null){
        const test = post.createPost(req.body);
        res.send(test);
    } else {
        res.send(Boom.badRequest('Request not formed correctly.'));
    }
});

module.exports = router;