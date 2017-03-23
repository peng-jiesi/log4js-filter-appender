/**
 * log4jsExt PM2Commond
 * Created by pengj on 2017-3-22.
 */
'use strict';

const pm2 = require('pm2');
const config = require('./PM2Config');
const q = require('q');

function sendMessage2Id(processid, data) {
    return new Promise(function (resolve, reject) {
        let message = {
            type: config.type,
            data: data,
            topic: config.topic
        };

        pm2.sendDataToProcessId(processid, message, function (err, res) {
            if (err) {
                console.error('Send to pm2 error, processId: %s, data: %j', processid, data, err);
                // 失败后,不做特殊处理
                resolve('error');
            } else {
                console.info('Send to pm2 success, processId: %s, data: %j', processid, data);
                resolve('done');
            }
        });
    });
}


function getIds() {
    return new Promise(function (resolve, reject) {
        pm2.list(function (err, list) {
            if (err) {
                reject(err);
            } else {
                resolve(list);
            }
        });
    });
}


function sendMessage2Name(processname, data) {
    return getIds(processname)
            .then(function (list) {
                let array = [];
                list.forEach(function (process) {
                    if (process.name === processname) {
                        array.push(sendMessage2Id(process.pm_id, data));
                    }
                });

                return Promise.all(array);
            });
}

function isEmpty(val) {
    return val === null || val === undefined || val === '';
}

function send(processid, processname, data) {
    if (isEmpty(processid) && isEmpty(processname)) {
        console.log('Please specify pm2 processId or processName');
        return false;
    }

    pm2.connect(function (err) {
        if (err) {
            console.error(err);
            process.exit(2);
        }

        let job;
        if (!isEmpty(processname)) {
            if (!isEmpty(processid)) {
                console.warn('Ignore the value of processId');
            }
            job = sendMessage2Name(processname, data);
        } else {
            job = sendMessage2Id(processid, data);
        }

        q.when(job).catch(function (err) {
            console.error(err);
        }).finally(function () {
            pm2.disconnect();
            process.exit(0);
        });

    });
}

function start(pid, pname, filter, catalog, level) {
    send(pid, pname, {
        method: 'startFilter',
        params: {
            catalog: catalog,
            level: level,
            filter: filter
        }
    });
}
exports.start = start;

function stop(pid, pname) {
    send(pid, pname, {
        method: 'stopFilter',
        params: {}
    });
}
exports.stop = stop;


function desc(pid, pname) {
    send(pid, pname, {
        method: 'showFilter',
        params: {}
    });
}
exports.desc = desc;
