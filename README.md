# log4js-filter-appender
based on log4js and pm2, filter log by word,level,category

The features include two parts, log4js appender and cli.
1, config appender into log4js 
2, use pm2 start app
3, use cli switch log filter

## log4js-filter-appender

### install 
>npm install log4js-filter-appender --save 

### use by coding 
 

``` javascript
let filterAppender = require('log4js-filter-appender');

// appender(appenderConfig)
let appender = filterAppender.appender({type: 'file', filename: 'logs/test/filter-1.log'});
log4js.addAppender(appender);
```
### use by config
``` javascript

log4js.configure({
    appenders: [
        {type: 'console'},
        {
            type: 'log4js-filter-appender',
            
            // appender value can be any log4js  appender config
            appender: {type: 'file', filename: 'logs/test2/filter-1.log'},
            category: 'test'
        },
        {
            type:'log4js-filter-appender',
            appender: {type: 'file', filename: 'logs/test2/filter-2.log'}
        }
    ]
});
```
## cli

###  install 
> npm install -g log4js-filter-appender

### command

 >  use _dlog4js_  change  filter   
 
 help 
 
 dlog4js -h
 
 Commands:

    start [options]   enable FilterAppender for log4js
    stop
  
  Options:

    -h, --help          output usage information
    -V, --version       output the version number
    -p --pid [n]        pm2 process id
    -n --pname [value]  pm2 process name
    
#### start  
  dlog4js start -h
  
  Usage: start [options]

  enable FilterAppender for log4js

  Options:

    -h, --help             output usage information
    -l --level [value]     log level
    -c --category [value]  log category
    -w --word [value]    filter log by this value, can be regular. ps: (test)|(info)
    -f --force [boolean] focre change logger level, true or false
    
  change  pm2 process '0' log level to info
  > dlog4js start -p 0 -l info 
    
#### stop
 stop pm2 process name 'test' log
 > dlog4js stop -n test
 

系统功能包括两个部分, log4js appender 和  cli. 

1, 通过配置log4js appender启动日志功能
2, pm2启动进程
3, 通过cli进行日志动态切换
