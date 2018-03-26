'use strict';
const admin = require('firebase-admin');
const Joi = require('joi');
const Boom = require('boom');

const internals = {
	schemas: {},
	config: {}
};

internals.schemas.configSchema = Joi.object().keys({
	projectId: Joi.string().required(),
	clientEmail: Joi.string().required(),
	privateKey: Joi.string().required()
});

internals.config = {
	projectId: process.env.PROJ_ID,
	clientEmail: process.env.CLIENT_EMAIL,
	privateKey: process.env.PRIV_KEY
};

exports.init = () => {
	Joi.validate(internals.config, internals.schemas.configSchema).catch((err) => {
	    throw Boom.badRequest(err.error);
	});
    
	admin.initializeApp({
		credential: admin.credential.cert(internals.config),
		databaseURL: process.env.DB_URL
	});
};