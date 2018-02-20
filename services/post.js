const Joi = require('joi');
const firebase = require('firebase');
const db = require('./../db');
const shortid = require('shortid');

const ref = db.firebase.database().ref('/posts');

const internals = {
    state: {}
}

exports.postSchema = Joi.object().keys({
    title: Joi.string().required(),
    author: Joi.string().required(),
    textBody: Joi.string().required(),
    date: Joi.date()
});

exports.createPost = function(req) {
    const res = {
        title: req.title,
        author: req.author,
        textBody: req.textBody,
        date: new Date().toISOString()
    }

    ref.child(shortid.generate()).set(res);

    return res;
};

exports.getPosts = async function(req){
   return await ref.once('value')
};
