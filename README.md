# Frontend workflow

Set of javascript tasks for front development

## Summary

* [Available tasks](#available-tasks)
* [Task execution](#task-execution)
* [Parameters](#parameters)
* [Configuration](#configuration)
* [Task](#task)
    * [Task class](#task-class)
    * [TaskProcess class](#taskprocess-class)
* [Template](#template)

## Available tasks

Available tasks :

* [`browserify`](https://github.com/substack/node-browserify)
* [`server`](https://github.com/BrowserSync/browser-sync)
* [`watch`](https://github.com/paulmillr/chokidar)
* [`uglify`](https://github.com/mishoo/UglifyJS2)
* [`postcss`](https://github.com/postcss/postcss)
* [`sass`](https://github.com/sass/sass)
* [`stylus`](https://github.com/stylus/stylus)
* [`typescript`](https://github.com/Microsoft/TypeScript)
* [`watcher`](https://github.com/paulmillr/chokidar)
* [`template`](#template)

## Tasks execution

```
node workflow stylus -w -m -s
```

Via `npm-scripts`

```
npm run stylus:compile
```

You can call scripts declared inside `package.json`, if the task does not exist inside the workflow.

```
node workflow stylus:compile browserify:compile
```


## Parameters

`subarg` is used to fetch your command parameters. `subarg` options are located at `config/parameters.js`.

Available parameters :

* `input`
* `output`
* `watch` - `false` by default
* `compress` - `false` by default
* `sourcemap` - `false` by default
* `verbose` - `true` by default. Display verbose log.
* `kill_pids` - `true` by default. Kill pids inside `tmp/pids`

You can ovveride these parameters by task inside your configuration file.


## Configuration

### Set a configuration file

By default, the workflow take the file at `config/tasks.js`. You can set a new path inside your `package.json`

```json
"workflow": {
    "config": "./workflow/config/tasks.js"
}
```

You can set a config file by environment. By default, `development` config file is used.

```json
"workflow": {
    "development": "./workflow/config/development.js",
    "production": "./workflow/config/production.js"
}
```

### Create a configuration file

The configuration file exports an `Object`. Each key of the object is the name of a task and the value is an array of object.


```js
const _tasks = {}

_tasks['browserify'] = [
    {   
        /**
         * Precise a file name
         * By default, this property is splitted to `input` and `output` parameters
         * 
         * For example :         
         *     file: "./app/index.js ./public/main.js"
         *
         *     equivalent to :
         *        
         *     override_parameters: {
         *         input: "./app/index.js",
         *         output: "./public/main.js"
         *     }        
         *
         */ 
        file: "./app/index.js ./public/main.js",
                        
        /**
         * You can override process parameters
         */
        override_parameters: {
            input: './app/index.js',
            output: './public/main.js',      
            watch: false,
            sourcemaps: false,
            compress: false            
        },
        options: {}
    }
]

module.exports = _tasks

```

## Task

### Create a new task

To create a new task, you have to choose between a `Task` object and a `TaskProcess` process. A `TaskProcess` extends `Task`. It is dedicated to child process execution.

#### Task class


```js
const Task = require('./../lib/Task')

class MyTask extend Task {

    /**
     * Override execute method
     * Take care to call `super.execute()`
     */
    execute() {
        /**
         * EXECUTE SOMETHING
         */
        super.execute()
    }
    
    /**
     * Override kill method
     * Take care to call `super.kill()`
     */
    kill() {
        // Kill or close something
        super.kill()
    }
	
}

module.exports = MyTask
```

**WARNING** Take care to call `super.execute()` at the end otherwise your task will be not registered inside the `TaskManager`


**Exemple :**

```js
const Task = require('./../lib/Task')
const Chokidar = require('chokidar')

class Watcher extend Task {

    constructor() {
        super(...arguments)
        this.watcher = null
    }

    /**
     * Override execute method
     * Take care to call `super.execute()`
     */
    execute() {
        const config  = this.getConfig()
        const watcher = Chokidar.watch(config.file, config.options)
        
        watcher.on('ready', function(file) {
            console.log('Ready to watch')
            this.on('add', function(file) {
                console.log('Add', file)
            })
        })
        
        watcher.on('change', function(file) {
            console.log('Change', file)
        })
        
        watcher.on('unlink', function(file) {
            console.log('Remove', file)
        })
        
        this.watcher = watcher
        
        super.execute()
    }
    
    /**
     * Override kill method
     * Take care to call `super.kill()`
     */
    kill() {
        this.watcher.close()
        super.kill()
    }
	
}

module.exports = Watcher
```

#### TaskProcess class


```js
const TaskProcess = require('./../lib/TaskProcess')

class MyTaskProcess extend TaskProcess {
    /**
     * Override execute method
     * You must pass your command inside `super.execute`
     * `super.execute` returns a `ChildProcess`
     */
    execute() {
        const command = "pwd"
        super.execute(command)
    }
}

module.exports = MyTaskProcess
```

**Exemple :**

```js
const TaskProcess       = require('./../lib/TaskProcess')
const STYLUS_CLI        = path.join(path.dirname(require.resolve('stylus')), 'bin', 'stylus')
const AUTOPREFIXER_PATH = path.dirname(require.resolve('autoprefixer-stylus'))

    
class Stylus extends TaskProcess {
    /**
     * Override execute method
     * You must pass your command inside `super.execute`
     */
    execute() {
        const config = this.getConfig()
        const params = this.getParameters()
        
        const input  = params.input
        const output = params.output
        
        const command = [STYLUS_CLI]
        if (params.sourcemaps) command.push("--sourcemap-inline")
        if (params.watch) command.push("--watch")
        if (params.compress) command.push("--compress")
        
        if (config.autoprefixer) {
            command.push('--use '+AUTOPREFIXER_PATH)
            command.push('--with'+JSON.stringify(config.autoprefixer))
        }
        
        command.push(input)
        command.push('--out')
        command.push(output)
        
        const ps = super.execute(command.join(' '))
        ps.on('close', this._onClose)
    }
    
    _onClose() {
        console.log('Stylus task is closed')
    }
}

module.exports = Stylus
```

## Template

You can create template file directly inside `workflow/templates/{{ extension_name }}`.

### Template configuration

Inside `config.yml`, you configure your template generation.

**Exemple :**

```js
_tasks['template'] = [{

    // Section template
    section: {
        output: "index",
        destination_path: "./app/sections",
        files: [
            "section.html",
            "stylus/section.styl",
            "js"
        ]
    },

    // Component template
    component: {
        destination_path: "./app/components",
        files: [
            "stylus/section.styl",
            "js/component.js"
        ]
    }
    
}]
```

`ouput` (optional) is the name of the file generated. By default, the name of the template is taken

`destination_path` is the directory where files will be generated

`files` are templates to use to generate files. You can indicate an extension, a filename or a path relative to the template directory


### Template generation

To generate a template :

```
node workflow {{ template }} {{ name }}
```

**Exemple :**

```
node workflow section MySectionName
```

You can add more parameters

```
npm run template section -- [ -name="MySectionName" --prefix="app" --test="HelloWorld" ]
```