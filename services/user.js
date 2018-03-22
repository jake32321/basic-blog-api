const Joi = require('joi');
const Boom = require('boom')
const admin = require('firebase-admin');
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

exports.createUser = (req) => {
    const result = Joi.validate(req, internals.schemas.userSchema);
    if (result.error === null) {
        return admin.auth().createUser({
            email: req.email,
            emailVerified: req.emailVerified,
            password: req.password,
            displayName: req.displayName,
            disabled: req.disabled
        }).then(userInfo => {
            ref.child(userInfo.uid).set({
                email: req.email,
                emailVerified: req.emailVerified,
                displayName: req.displayName,
                disabled: req.disabled
            });
        }).catch(err => {
            return err;
        });
    } else {
        throw Boom.badRequest(result.error)
    }
}