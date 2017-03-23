/**
 * log4jsExt test
 * Created by pengj on 2017-3-21.
 */
'use strict';
const log4js = require('log4js');
const path = require('path');

log4js.configure({
    appenders: [
        {type: 'console'},
        {type: 'file', filename: 'logs/test2/cheese.log', category: 'cheese'},
        {type: 'file', filename: 'logs/test2/test.log', category: 'test'},
        {
            type: path.join(__dirname, '../index.js'),
            appender: {type: 'file', filename: 'logs/test2/filter-1.log'},
            category: 'test'
        },
        {
            type: path.join(__dirname, '../index.js'),
            appender: {type: 'file', filename: 'logs/test2/filter-2.log'}
        }
    ]
});


const logger = log4js.getLogger('cheese');
logger.setLevel('debug');

const logger2 = log4js.getLogger('test');
logger2.setLevel('trace');
setTimeout(function () {
    setInterval(function () {
        logger.trace('Entering cheese testing');
        logger.debug('Got cheese.');
        logger.info('Cheese is Gouda.');
        logger.warn('Cheese is quite smelly.');
        logger.error('Cheese is too ripe!');
        logger2.trace('test %s', new Date());
    }, 10000);
}, 5000);



