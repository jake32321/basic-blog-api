const Joi = require('joi');
const Boom = require('boom')
const firebase = require('firebase');
const db = require('./../lib/db');
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

internals.schemas.updatePostSchema = Joi.object().keys({
    title: Joi.string().optional(),
    author: Joi.string().optional(),
    textBody: Joi.string().optional(),
    date: Joi.date()
});

internals.schemas.isValidShortId = Joi.string().regex(/^[a-zA-Z0-9_-]{7,14}$/).required();

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
    let data;
    return await ref.once('value', snapshot => {
        data = snapshot.val();
    });
    return data;
};

exports.getPostById = async function(req){
    const result = Joi.validate(req.params.id, internals.schemas.isValidShortId);
    if (result.error === null){
        let data;
        const postByIdRef = ref.child(req.params.id);
        await postByIdRef.once('value', snapshot => {
            data = snapshot.val();
        });
        return data;
    } else {
        throw Boom.badRequest(result.error);
    }
}

exports.updatePost = async function(req, id){
    const resultReq = Joi.validate(req, internals.schemas.updatePostSchema);
    const resultId = Joi.validate(id, internals.schemas.isValidShortId);

    if (resultId.error === null) {
        if (resultReq.error === null){
            let data;
            const postByIdRef = ref.child(id);
            postByIdRef.update(req);
            await postByIdRef.once('value', snapshot => {
                data = snapshot.val();
            });
            return data;
        } else {
            throw Boom.badRequest(resultReq.error);
        }
    } else {
        throw Boom.badRequest('Id is not valid');
    }
}