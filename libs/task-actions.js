module.exports = function($, cfg, env, args) {
    
    var path = require('path'),
        glob = require('glob'),
        taskName = process.argv.length > 2 ? process.argv[2] : 'default',
        taskPath = sprintf("%s/tasks/%s", process.cwd(), taskName.replace(/\:/gi, '/'));

    return function(options) {
        action = 'default'
        if(options.default) action = options.default;
        if(_.toArray(args).length > 0) action = args[0];
        try {
            if(_.indexOf(options.actions, action) == -1)
                throw("Invalid action of current task");
            actionPath = sprintf("%s/actions/%s.js", taskPath, action );
            require(actionPath)($, cfg, env, args);
        } catch(ex) {
            tracer.error(ex);
        }
    };    

};