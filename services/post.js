const Joi = require('joi');
const Boom = require('boom')
const admin = require('firebase-admin');
const shortid = require('shortid');
const _ = require('lodash');
const moment = require('moment');
const ref = admin.database().ref('/posts');

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

postDataExists = async (id) => {
    const payload = await Joi.validate(id, internals.schemas.isValidShortId).catch(error => {
        throw Boom.badRequest('Id is not valid.');
    });

    const snapshot = await ref.child(payload).once('value');

    const exists = snapshot.val() ? true : false;
    return exists;
};

exports.createPost = async (req) => {
    const postId = shortid.generate();
    const payload = await Joi.validate(req, internals.schemas.postSchema).catch(error => {
        throw Boom.badRequest(error);
    });

    const dataToPost = _.pick(req, ['title', 'author', 'textBody']);

    _.extend(dataToPost, {
        id: postId,
        date: moment().toISOString()
    });

    await ref.child(postId).set(dataToPost);
    return dataToPost;
};

exports.getPosts = async (req) => {
    return await ref.once('value');
};

exports.getPostById = async (id) => {
    const exists = await postDataExists(id);
    if (!exists) {
        throw Boom.badRequest(`Could not find Post with ID: ${id}`);
    }
    const snapshot = await ref.child(id).once('value');
    return snapshot.val();
}

exports.updatePost = async (req, id) => { 
    const result = await Joi.validate(req, internals.schemas.updatePostSchema).catch(error => {
        throw Boom.badRequest('Request poorly formed.');
    });

    const exists = await postDataExists(id);

    if (!exists) {
        throw Boom.badRequest(`Could not find Post with ID: ${id}`);
    }

    await ref.child(id).update(req);
    const snapshot = await ref.child(id).once('value');
    return snapshot.val();
}

exports.deletePost = async (id) => {
    const exists = await postDataExists(id);

    if (!exists) {
        throw Boom.badRequest(`Could not find Post with ID: ${id}`);
    }

    await ref.child(id).remove();
    return { message: `Post ${id}, has been deleted.` };
}

        