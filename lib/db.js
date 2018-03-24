const admin = require('firebase-admin');
const Joi = require('Joi');
const Boom = require('Boom');

const internals = {
    schemas: {},
    config: {}
};

internals.schemas.configSchema = Joi.object().keys({
    projectId: Joi.string().required(),
    clientEmail: Joi.string().required(),
    privateKey: Joi.string().required()
})

internals.config = {
    projectId: process.env.PROJ_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIV_KEY
};

exports.init = () => {
    const result = Joi.validate(internals.config, internals.schemas.configSchema);
    if (result.error === null){
        admin.initializeApp({
            credential: admin.credential.cert(internals.config),
            databaseURL: process.env.DB_URL
        });
    } else {
        throw Boom.badRequest(result.error);
    }
}