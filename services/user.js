const Joi = require('joi');
const Boom = require('boom');
const admin = require('firebase-admin');
const _ = require('lodash');
const ref = admin.database().ref('/users');

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

exports.createUser = async (req) => {
    const payload = await Joi.validate(req, internals.schemas.userSchema).catch(err => {
        throw Boom.badRequest(err);
    });

    const userInfo = await admin.auth().createUser(payload);

    const userRef = ref.child(userInfo.uid);
    const dataToFB = _.pick(payload, ['email', 'emailVerified', 'displayName', 'disabled']);

    await userRef.set(dataToFB);  
    const userData = await userRef.once('value');
    return _.extend(userData.val(), {
        id: userInfo.uid
    });
};