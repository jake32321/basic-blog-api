const express = require('express');
const user = require('../services/user');
const router = require('express').Router();

router.post('/', (req, res) => {
    user.createUser(req.body).then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err.output.payload);
    });
});

router.delete('/:id', (req, res) => {
    user.deleteUser(req.params.id).then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err.output.payload);
    });
});

module.exports = router;