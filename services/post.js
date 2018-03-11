const Joi = require('joi');
const Boom = require('boom')
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

exports.createPost = function(req) {
    const result = Joi.validate(req, internals.schemas.postSchema)

    if (result.error == null) {
        let res = {
            title: req.title,
            author: req.author,
            textBody: req.textBody,
            date: new Date().toISOString()
        }
    
        const postId = shortid.generate()
        ref.child(postId).set(res);
        res.id = postId;
        return res;
    } else {
        throw Boom.badRequest(result.error);
    }
};

exports.getPosts = async function(req){
   return await ref.once('value')
};

exports.getPostById = async function(req){
    const postByIdRef = ref.child(req.params.id);

    return await postByIdRef.once('value');
}

exports.updatePost = async function(req, id){

    const postByIdRef = ref.child(req.params.id);

    const dataToPost = {
        title: req.title,
        author: req.author,
        textBody: req.textBody,
        date: new Date().toISOString()
    }

    postByIdRef.set(dataToPost)

    return dataToPost;
}