'use strict';
const user = require('../services/user');
const router = require('express').Router();

router.post('/', async (req, res) => {
    try {
        const result = user.createUser(req.body);
        res.send(result);
    } catch (err) {
        res.send(err.output.payload);
    }
});

router.delete('/:uid', (req, res) => {
    try {
        const result = user.deleteUser(req.params.uid);
        res.send(result);
    } catch (err) {
        res.send(err.output.payload);
    }
});

router.get('/:uid', (req, res) => {
    try {
        const result = user.getUserById(req.params.uid);
        res.send(result);
    } catch (err) {
        res.send(err.output.payload);
    }
});

router.put('/:uid', async (req, res) => {
    try {
        const result = await user.updateUser(req.params.uid, req.body);
        res.send(result);
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;