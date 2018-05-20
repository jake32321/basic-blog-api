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

internals.schemas.updateUserSchema = Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,10}$/),
    displayName: Joi.string()
});

exports.createUser = async function(req) {
    const payload = await Joi.validate(req, internals.schemas.userSchema).catch((err) => {
        throw Boom.badRequest(err);
    });

    _.extend(payload, {
        uid: shortid.generate()
    });

    const dataToFB = _.pick(payload, ['email', 'displayName']);
    const responseData = _.pick(payload, ['uid', 'email', 'displayName']);

    await admin.auth().createUser(payload);
    await ref.child(payload.uid).set(dataToFB);  

    return responseData;
};

exports.deleteUser = async function(id) {
    const exists = await dataExists(id, ref);
    
    if (!exists) {
        throw Boom.notFound(`User with the ID: ${id}, does not exist.`);
    }

    await admin.auth().deleteUser(id);
    await ref.child(id).remove();

    return { message: `User with ID: ${id}, has been deleted.` };
};

exports.getUserById = async function(id) {
    const exists = await dataExists(id, ref);

    if (!exists){
        throw Boom.notFound(`User with the ID: ${id}, does not exist.`);
    }

    const snapshot = await ref.child(id).once('value');
    return snapshot.val();
};

exports.updateUser = async (id, req) => {
    const exists = await dataExists(id, ref);

    let payload = null;

    try {
        payload = await Joi.validate(req, internals.schemas.updateUserSchema);
    } catch (err) {
        throw Boom.badRequest(err);
    }
    
    if (!exists) {
        throw Boom.notFound(`User with the ID: ${id}, could not be found.`);
    }

    // Update data from the current using the req data
    const snapshot = await ref.child(id).once('value');
    const data = snapshot.val();

    for (var key in payload){
        if (data.hasOwnProperty(key)) {
            data[key] = payload[key];
        }
    }

    // Write the new data to the DB and admin API.
    await admin.auth().updateUser(id, data);
    await ref.child(id).set(data);

    return {
        message: `User: ${id}, has been updated!`,
        data
    }
}