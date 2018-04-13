module.exports = function($, cfg, env, args) {
    
    var taskList = [];

    var Task = function(name, actions, options={}) {
        this.name = name;
        this.actions = actions;
        this.options = options;
        this.taskPath = sprintf("%s/tasks/%s", process.cwd(), this.name.replace(/\:/gi, '/'))

        this.start = function(action=null) {
            try {
                if(_.isNull(action)) action = this.actions[0];
                if(_.indexOf(this.actions, action) == -1)
                    throw("Invalid action of current task");
                actionPath = sprintf("%s/%s.js", this.taskPath, action );
                return require(actionPath)($, cfg, env, args);
            } catch(ex) {
                tracer.error(ex);
            }
        }
    };

    return {
        registerTask: function(name, actions, options) {
            taskList[name] = new Task(name, actions, options);
            return taskList[name];
        },
        loadTask: function(name) {
            return !_.isUndefined(taskList[name]) ? taskList[name] : null;
        },
        startTask: function(name, action=null) {
            if(!_.isUndefined(taskList[name])) return taskList[name].start(action);

        },
        runSequence: function() {
            
        }
    }

};