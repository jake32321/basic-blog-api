const Joi = require('joi');
const Boom = require('boom')
const admin = require('firebase-admin');
const shortid = require('shortid');
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
    const result = Joi.validate(id, internals.schemas.isValidShortId);
    if (result.error === null) {
        return await ref.child(id).once('value').then(snapshot => {
            if(snapshot.val() !== null){
                return true;
            } else {
                return false;
            }
        });
    } else {
        throw Boom.badRequest('Id is not valid.');
    }
};

exports.createPost = (req) => {
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

exports.getPosts = async (req) => {
    return await ref.once('value', snapshot => {
        return snapshot.val();
    });
};

exports.getPostById = (id) => {
    return postDataExists(id).then(boolVal => {
        if (boolVal){
            return ref.child(id).once('value').then(snapshot => {
                return snapshot.val();
            });
        } else {
            throw Boom.badRequest(`Could not find Post with ID: ${id}`);
        }
    });
}

exports.updatePost = (req, id) => { 
    return postDataExists(id).then(boolVal => {
        const result = Joi.validate(req, internals.schemas.updatePostSchema);
        if (result.error === null) {
            if (boolVal){
                return ref.child(id).update(req);
            } else {
                throw Boom.badRequest(`Could not find Post with ID: ${id}`);
            }
        } else {
            throw Boom.badRequest('Request poorly formed.')
        }
    }).then(() => {
        return ref.child(id).once('value').then(snapshot => {
            return snapshot.val();
        });
    });
}

exports.deletePost = (id) => {
    return postDataExists(id).then(boolVal => {
        if (boolVal){
            ref.child(id).remove();
            return { 
                message: `Post ${id}, has been deleted.` 
            };
        } else {
            throw Boom.badRequest(`Could not find Post with ID: ${id}`);
        }
    });
}

        