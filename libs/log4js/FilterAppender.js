/**
 * log4jsExt FilterAppender
 * Created by pengj on 2017-3-22.
 */
'use strict';
const log4js = require('log4js');
const levels = log4js.levels;
const util = require('util');

const pm2 = require('../pm2/PM2Listener');

function formatLogData(logData) {
    let data = logData;
    if (!Array.isArray(data)) {
        let numArgs = arguments.length;
        data = new Array(numArgs);
        for (let i = 0; i < numArgs; i++) {
            data[i] = arguments[i];
        }
    }
    return util.format.apply(util, data);
}

class AppenderFilter {

    constructor() {
        this.enable = false;
        this.level = levels.toLevel('info');
        this.filter = undefined;
        this.category = undefined;
    }


    isEnableLevel(level) {
        if (this.level) {
            return level.isGreaterThanOrEqualTo(this.level);
        } else {
            return true;
        }
    }

    isEnableCategory(category) {
        if (this.category) {
            return this.category === category;
        } else {
            return true;
        }
    }

    isEnableFilter(data) {
        if (this.filter) {
            let message = formatLogData(data);
            return this.filter.test(message);
        } else {
            return true;
        }
    }

    isEnable(loggingEvent) {
        return this.enable && this.isEnableCategory(loggingEvent.category) && this.isEnableLevel(loggingEvent.level) && this.isEnableFilter(loggingEvent.data);
    }

    startFilter(config) {
        Object.assign(this, config);
        if (this.filter) {
            this.filter = new RegExp(this.filter);
        }
        this.enable = true;
        console.log('switch filter, filter: %s\tlevel:%s\tcategory:%s', this.filter, this.level, this.category);
    }

    stopFilter() {
        this.enable = false;
        this.level = levels.toLevel('error');
        this.filter = undefined;
        this.category = undefined;
    }

    showFilter() {
        console.log('filter: %s\tlevel:%s\tcategory:%s', this.filter, this.level, this.category);
    }
}

function getWorkAppender(appenderConfig, options) {
    log4js.loadAppender(appenderConfig.type);
    let appender = log4js.appenderMakers[appenderConfig.type](
            appenderConfig,
            options
    );
    return appender;
}


//TODO 增加其他通道 listeners
function createAppender(appender, listeners) {
    let filter = new AppenderFilter();

    pm2.listener(filter);

    return function (loggingEvent) {
        try {
            if (filter.isEnable(loggingEvent)) {
                appender(loggingEvent);
            }
        } catch (err) {
            console.error('FilterAppender error', err);
            filter.stopFilter();
        }
    };
}


exports.appender = function (appenderConfig, listeners) {
    let appender = getWorkAppender(appenderConfig);
    return createAppender(appender, listeners);
};

exports.configure = function (config, options) {
    let appender = getWorkAppender(config.appender);
    return createAppender(appender, config.listeners);
};
