const express = require('express');
const post = require('../services/post');
const router = require('express').Router();

router.get('/', (req, res) => {
    post.getPosts().then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err.output.payload);
    });
});

router.post('/', (req, res) => {
    post.createPost(req.body).then(data => {
        res.send(data);
    }).catch(err => {
        res.send(err.output.payload);
    });
});

router.get('/:id', (req, res) => {
    post.getPostById(req.params.id).then(data => {
        res.send(data)
    }).catch((err) => {
        res.send(err.output.payload);
    });
});

router.put('/:id', (req, res) => {
    post.updatePost(req.body, req.params.id).then(data => {
        res.send(data);
    }).catch(err => {
        res.send(err.output.payload);
    });  
});

router.delete('/:id', (req, res) => {
    post.deletePost(req.params.id).then(data => {
        res.send(data);
    }).catch(err => {
        res.send(err.output.payload);
    });  
});

module.exports = router;