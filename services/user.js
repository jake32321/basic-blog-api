'use strict';
const Joi = require('joi');
const Boom = require('boom');
const { dataExists } = require('../lib/helpers');
const admin = require('firebase-admin');
const _ = require('lodash');
const shortid = require('shortid');
const ref = admin.database().ref('/users');

const internals = {
    schemas: {}
};

internals.schemas.userSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    emailVerified: Joi.boolean().default(false),
    password: Joi.string().required(),
    displayName: Joi.string().required(),
    disabled: Joi.boolean().default(false)
});

// internals.schemas.updateUserSchema = Joi.object().keys({
//     email: Joi.string().email().optional(),
//     password
// });

exports.createUser = async (req) => {
    const payload = await Joi.validate(req, internals.schemas.userSchema).catch((err) => {
        throw Boom.badRequest(err);
    });

    _.extend(payload, {
        uid: shortid.generate()
    });

    const dataToFB = _.pick(payload, ['email', 'emailVerified', 'displayName', 'disabled']);
    const responseData = _.pick(payload, ['uid', 'email', 'emailVerified', 'displayName', 'disabled']);

    const user = await admin.auth().createUser(payload);
    // await user.sendEmailVerification();
    await ref.child(payload.uid).set(dataToFB);  

    return responseData;
};

exports.deleteUser = async (id) => {
    const exists = await dataExists(id, ref);
    
    if (!exists) {
        throw Boom.badRequest(`User with the ID: ${id}, does not exist.`);
    }

    await admin.auth().deleteUser(id);
    await ref.child(id).remove();

    return { message: `User with ID: ${id}, has been deleted.` };
};

exports.getUserById = async (id) => {
    const exists = await dataExists(id, ref);

    if (!exists){
        throw Boom.badRequest(`User with the ID: ${id}, does not exist.`);
    }

    const snapshot = await ref.child(id).once('value');
    return snapshot.val();
};

// exports.updateUser = async (id, req) => {
//     const payload = await Joi.validate();

//     const exists = await dataExists(id, ref);
// }