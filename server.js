'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./lib/db');
const hbs = require('express-handlebars');
const morgan = require('morgan');

db.init();

const app = express();

const port = process.env.PORT || 3000;
const ip = process.env.IP || 'localhost'

app.engine('hbs', hbs({
    extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('public'));
app.use('/posts', require('./routes/post'));
app.use('/users', require('./routes/user'));
app.use(morgan('dev', {
    skip: (req, res) => {
        return res.statusCode >= 400
    },
    stream: process.stderr 
}));
app.use(morgan('dev', {
    skip: (req, res) => {
        return res.statusCode < 400
    },
    stream: process.stdout 
}));

app.get('/', (req, res) => {
    const opts = {
        ip
    }

    res.render('index', opts);
});

app.listen(port, () => {
    console.log(`Server is running at http://${ip}:${port}`);
})

