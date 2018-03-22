const express = require('express');
const Boom = require('boom');
const user = require('../services/user');
const router = require('express').Router();

router.post('/', async (req, res) => {
    await user.createUser(req.body).then(result => {
        res.send(result);
    }).catch(error => {
        res.send(error);
    });
});

module.exports = router;