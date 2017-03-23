/**
 * log4jsExt cli
 * Created by pengj on 2017-3-23.
 */
'use strict';
const program = require('commander');
const pkg = require('../package.json');
const pm2Cmd = require('./pm2/PM2Command');

program.version(pkg.version)
        .option('-p --pid [n]', 'pm2 process id')
        .option('-n --pname [value]', 'pm2 process name');


program.command('start')
        .description('enable FilterAppender for log4js')
        .option('-i --pid [n]', 'pm2 process id')
        .option('-n --pname [value]', 'pm2 process name')
        .option('-l --level [value]', 'log level', /^(TRACE|DEBUG|INFO|WARN|ERROR)$/i, 'INFO')
        .option('-c --category [value]', 'log category')
        .option('-f --filter [value]', 'filter log by this value, can be regular. ps: (test)|(info)')
        .action(function (env) {
            pm2Cmd.start(program.pid, program.pname, env.filter, env.category, env.level);
        });

program.command('stop')
        .action(function () {
            pm2Cmd.stop(program.pid, program.pname);
        });

program.command('desc')
        .action(function () {
            pm2Cmd.desc(program.pid, program.pname);
        });

program.parse(process.argv);