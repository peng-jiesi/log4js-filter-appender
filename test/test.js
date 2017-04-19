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
let filterAppender = require('../libs/log4js/FilterAppender');
let appender = filterAppender.appender({type: 'file', filename: 'logs/test/filter-1.log'});
log4js.addAppender(appender);

log4js.setGlobalLogLevel('warn');

const logger = log4js.getLogger('cheese');
const logger2 = log4js.getLogger('test');
logger2.setLevel('trace');

setInterval(function () {
    logger.trace('Trace');
    logger.debug('Debug');
    logger.info('Info');
    logger.error('Error');
    logger.warn('Warn');


    logger2.trace('test %s', new Date());
}, 10000);



