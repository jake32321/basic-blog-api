const Joi = require('joi');
const Boom = require('boom')
const firebase = require('firebase');
const db = require('./../lib/db');
const bcrypt = require('bcrypt');
const ref = db.firebase.database().ref('/posts');

const internals = {
    schemas: {}
}

internals.schemas.userSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    emailVerified: Joi.boolean().default(false),
    password: Joi.string().required(),
    displayName: Joi.string().required(),
    disabled: Joi.boolean().default(false)
});