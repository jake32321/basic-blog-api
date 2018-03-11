const express = require('express');
const Joi = require('joi');
const Boom = require('boom');
const post = require('../services/post');
const router = require('express').Router();

router.get('/', async (req, res) => {
    await post.getPosts().then(result => {
        res.send(result);
    });
});

router.get('/:id', async (req, res) => {
    await post.getPostById(req).then(result => {
        res.send(result);
    })
});

router.post('/', (req, res) => {
    const result = Joi.validate(req.body, post.postSchema);

    if(result.error === null){
        const postRes = post.createPost(req.body);
        res.send(postRes);
    } else {
        res.send(Boom.badRequest('Request not formed correctly.'));
    }
});

router.put('/:id', async (req, res) => {
    const result = Joi.validate(req.body, post.schemas.postSchema);

    if(result.error === null){
        const postUpdateRes = await post.updatePost(req);
        res.send(postUpdateRes);
    } else {
        res.send(Boom.badRequest('Request not formed correctly for update.'))
    }
});

module.exports = router;