const express = require('express');
const Boom = require('boom');
const user = require('../services/user');
const router = require('express').Router();

router.post('/', (req, res) => {
    user.createUser(req.body).then(result => {
        res.send(result);
    }).catch(error => {
        res.send(error);
    });
});

module.exports = router;