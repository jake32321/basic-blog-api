const express = require('express');
const Joi = require('joi');
const Boom = require('boom');
const db = require('./db');
const app = express();

require('dotenv').config();

const port = process.env.PORT || 3000;
const ip = process.env.IP || 'localhost'

app.get('/', (req, res) => {
    res.send('hello there');
});

app.listen(port, () => {
    console.log(`Server is running at http://${ip}:${port}`);
})

