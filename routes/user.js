'use strict';
const user = require('../services/user');
const router = require('express').Router();

router.post('/', (req, res) => {
    user.createUser(req.body).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send(err.output.payload);
    });
});

router.delete('/:uid', (req, res) => {
    user.deleteUser(req.params.uid).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send(err.output.payload);
    });
});

router.get('/:uid', (req, res) => {
    user.getUserById(req.params.uid).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send(err.output.payload);
    });
});

router.put('/:uid', async (req, res) => {
    try {
        const data = await user.updateUser(req.params.uid, req.body);
        res.send(data);
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;