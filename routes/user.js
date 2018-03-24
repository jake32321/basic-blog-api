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

router.delete('/:uid', (req, res) => {
    user.deleteUser(req.params.uid).then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err.output.payload);
    });
});

router.get('/:uid', (req, res) => {
    user.getUserById(req.params.uid).then(result => {
        res.send(result);
    }).catch(err => {
        res.send(err.output.payload);
    });
});

module.exports = router;