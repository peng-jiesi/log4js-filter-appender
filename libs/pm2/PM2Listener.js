/**
 * log4jsExt PM2Listener
 * Created by pengj on 2017-3-22.
 */
'use strict';
const config = require('./PM2Config');

function isFun(fun) {
    return typeof fun === 'function';
}

function callMethod(filter, message) {
    let method = filter[message.method];
    let params = message.params;

    if (filter && isFun(method)) {
        method.call(filter, params);
    }
}

exports.listener = function (filter) {
    if (filter) {
        process.on('message', function (packet) {
            if (packet.type === config.type) {
                callMethod(filter, packet.data);
            }
        });
    }
};
