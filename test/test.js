/**
 * log4jsExt test
 * Created by pengj on 2017-3-21.
 */
'use strict';
const log4js = require('log4js');
log4js.configure({
    appenders: [
        {type: 'console'},
        {type: 'file', filename: 'logs/test/cheese.log', category: 'cheese'},
        {type: 'file', filename: 'logs/test/test.log', category: 'test'}
    ]
});
let filterAppender = require('log4js-filter-appender');
let appender = filterAppender.appender({type: 'file', filename: 'logs/test/filter-1.log'});
log4js.addAppender(appender);
const logger = log4js.getLogger('cheese');
logger.setLevel('debug');

const logger2 = log4js.getLogger('test');
logger2.setLevel('trace');

setInterval(function () {
    logger.trace('Entering cheese testing');
    logger.debug('Got cheese.');
    logger.info('Cheese is Gouda.');
    logger.warn('Cheese is quite smelly.');
    logger.error('Cheese is too ripe!');
    logger2.trace('test %s', new Date());
}, 10000);


