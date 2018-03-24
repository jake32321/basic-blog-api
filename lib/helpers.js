'use strict';
const Joi = require('joi');
const Boom = require('boom');

const internals = {
    schemas: {}
};

internals.schemas.isValidShortId = Joi.string().regex(/^[a-zA-Z0-9_-]{7,14}$/).required();

exports.postDataExists = async (id, ref) => {
    const payload = await Joi.validate(id, internals.schemas.isValidShortId).catch(error => {
        throw Boom.badRequest('Id is not valid.');
    });

    const snapshot = await ref.child(payload).once('value');

    const exists = snapshot.val() ? true : false;
    return exists;
};