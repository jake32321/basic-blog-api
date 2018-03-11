const Joi = require('joi');
const firebase = require('firebase');
const db = require('./../db');
const shortid = require('shortid');

const ref = db.firebase.database().ref('/posts');

const internals = {
    schemas: {}
}

internals.schemas.postSchema = Joi.object().keys({
    title: Joi.string().required(),
    author: Joi.string().required(),
    textBody: Joi.string().required(),
    date: Joi.date()
});

internals.createPost = function(req) {
    const res = {
        title: req.title,
        author: req.author,
        textBody: req.textBody,
        date: new Date().toISOString()
    }

    ref.child(shortid.generate()).set(res);
    return res;
};

internals.getPosts = async function(req){
   return await ref.once('value')
};

internals.getPostById = async function(req){
    const postByIdRef = ref.child(req.params.id);
    return await postByIdRef.once('value');
}

internals.updatePost = async function(req, id){
    const postByIdRef = ref.child(req.params.id);
    const dataToPost = {
        title: req.body.title,
        author: req.body.author,
        textBody: req.body.textBody,
        date: new Date().toISOString()
    }

    postByIdRef.set(dataToPost)
    return dataToPost;
}

module.exports = internals;