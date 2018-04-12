'use strict';
const bunyan = require('bunyan');
const moment = require('moment');

const logger = bunyan.createLogger({
    name: 'Campfire',
    level: 'info',
    stream: process.stdout,
    time: moment().toISOString()
}).log;

module.exports.logger = logger;