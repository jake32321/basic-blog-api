'use strict';
const winston = require('winston');

exports.errorLog = new winston.Logger({
    level: 'error',
    exceptionHandlers: [
        new winston.transports.File({filename: '../logs/exceptions.log'})
    ],
    transports: [
        new winston.transports.Console({
            name: 'error',
            level: 'error',
            colorize: true
        })
    ],
    exitOnError: false
});

exports.requestLog = new winston.Logger({
    level: 'info',
    exceptionHandlers: [
        new winston.transports.File({filename: '../logs/exceptions.log'})
    ],
    transports: [
        new winston.transports.Console({
            name: 'req',
            level: 'info',
            colorize: true
        })
    ],
    exitOnError: false
});

exports.infoLog = new winston.Logger({
    levels: 'info',
    exceptionHandlers: [
        new winston.transports.File({filename: '../logs/exceptions.log'})
    ],
    transports: [
        new winston.transports.Console({
            name: 'info',
            level: 'info',
            colorize: true
        })
    ],
    exitOnError: false
});

// const logger = new winston.Logger({
//   transports: [
//     new winston.transports.Console(options.console)
//   ],
//   exitOnError: false
// });

// logger.stream = {
//   write: function(message, encoding) {
//     logger.info(message)
//   }
// };

// module.exports = logger;