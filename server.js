'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./lib/db');
const hbs = require('express-handlebars');
const router = require('express').Router();
const path = require('path');


db.init();

const app = express();

const port = process.env.PORT || 3000;
const ip = process.env.IP || 'localhost'

app.engine('hbs', hbs({
    extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));

app.use(router)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/posts', require('./routes/post'));
app.use('/users', require('./routes/user'));

app.get('/', (req, res) => {
    const opts = {
        ip: port
    }

    res.render('index', opts);
});

app.listen(port, () => {
    console.log(`Server is running at http://${ip}:${port}`);
})

