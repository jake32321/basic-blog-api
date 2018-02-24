const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi');
const Boom = require('boom');
const post = require('./services/post');
const app = express();

require('dotenv').config();

const port = process.env.PORT || 3000;
const ip = process.env.IP || 'localhost'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.get('/posts', async (req, res) => {
    await post.getPosts().then(result => {
        res.send(result);
    })
});

app.get('/posts/:id', async (req, res) => {
    await post.getPostById(req).then(result => {
        res.send(result);
    })
});

app.post('/posts', (req, res) => {
    const result = Joi.validate(req.body, post.postSchema);

    if(result.error === null){
        const test = post.createPost(req.body);
        res.send(test);
    } else {
        res.send(Boom.badRequest('Request not formed correctly.'));
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://${ip}:${port}`);
})

