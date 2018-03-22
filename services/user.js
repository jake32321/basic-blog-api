const Joi = require('joi');
const { promisify } = require('util');
const Boom = require('boom')
const admin = require('firebase-admin');
const _ = promisify(require('lodash'));
const ref = admin.database().ref('/users');

const internals = {
    schemas: {},
    saltIter: 10
}

internals.schemas.userSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    emailVerified: Joi.boolean().default(false),
    password: Joi.string().required(),
    displayName: Joi.string().required(),
    disabled: Joi.boolean().default(false)
});

exports.createUser = async (req) => {
    const properties = {};
    properties.payload = await Joi.validate(req, internals.schemas.userSchema);
    properties.userInfo = await admin.auth().createUser(properties.payload);

    const userRef = ref.child(properties.userInfo.uid);
    const dataToFB = _.pick(properties.payload, ['email', 'emailVerified', 'displayName', 'disabled']);

    await userRef.set(dataToFB);  
    return userRef.once('value')
}