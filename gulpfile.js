var gulp                = require('gulp'),
    doc                 = require('gulp-task-doc').patchGulp(),
    $                   = require('gulp-load-plugins')({lazy: true}),
    args                = require('get-gulp-args')();
    cfg                 = require('./config/config.json');
    env                 = require('./env/'+cfg.environment+'.json');
    taskListing         = require('gulp-task-listing');
    sprintf             = require('sprintf').sprintf;
    vsprintf            = require('sprintf').vsprintf,
    terminalRenderer    = require('marked-terminal');
    chalk               = require('chalk'),
    colors              = require('colors'),
    appModulePath       = require('app-module-path'),
    fs                  = require('fs');


gulp.Gulp.prototype.__runTask = gulp.Gulp.prototype._runTask;
gulp.Gulp.prototype._runTask = function(task) {
    this.currentTask = task;
    this.__runTask(task);
}

// setting globals
global._                = require('lodash');
global.path             = require('path');
global.aws              = require('aws-sdk');
global.tracer           = require('gulp-tracer');
global.printMessage     = require('print-message');  
global.process          = require('process');  
global.marked           = require('marked');
global.taskManager      = require('./libs/task-manager')($, cfg, env, args);


require('console.table');

// initial configurations
var awsConfig = require('./config/aws.json').profiles[cfg.profile];
aws.config.update({
    accessKeyId: awsConfig.accessKeyId, 
    secretAccessKey: awsConfig.secretAccessKey
});
appModulePath.addPath(__dirname);
marked.setOptions({
    renderer: new terminalRenderer({
        tableOptions: {
            style: {'head': ['green']}
        }
    })
});

printMessage([
    sprintf("Client: %s (%s)", env.client, env.prefix),
    sprintf("AWS account profile: %s", cfg.profile),
    sprintf("Environment profile: %s", cfg.environment),
    sprintf("Region: %s", env.region )
]);


// Load all task.js files recursively
var taskList = require('recursive-readdir-sync')('./tasks/');
taskList.forEach(function (file) {
    filename = path.basename(file);
    if( !_.endsWith(filename, '.task.js') ) return;
    require('./'+file)(gulp, $, cfg, env, args);
});

// register default (task info) and help tasks
gulp.task('default', taskListing);
gulp.task('help', doc.help());
