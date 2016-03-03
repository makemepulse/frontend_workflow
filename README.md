# Frontend workflow

Set of javascript tasks for front development

## Tasks

Available tasks :

* [`browserify`](https://github.com/substack/node-browserify)
* [`server`](https://github.com/BrowserSync/browser-sync)
* [`watch`](https://github.com/paulmillr/chokidar)
* [`uglify`](https://github.com/mishoo/UglifyJS2)
* [`postcss`](https://github.com/postcss/postcss)
* [`sass`](https://github.com/sass/sass)
* [`stylus`](https://github.com/stylus/stylus)


Every tasks have the same parameters :

* `-m` to compress the file
* `-s` to add inline source map
* `-w` to watch the file

You can add more parameters inside `workflow/lib/args.js`.

Every task configurations are located inside `workflow/config.yml`.


## Template

You can create template file directly inside `workflow/templates/{{ extension_name }}`.

Inside `config.yml`, you configure your template generation.

**Exemple :**

```
template:

  # Section template
  section:
    output: index
    destination_path: "{{ &global.src_path }}/sections"
    files:
      - section.html
      - stylus/section.styl
      - js

  # Component template
  component:
    destination_path: "{{ &global.src_path }}/components"
    files:
      - stylus/section.styl
      - js/component.js
```

`ouput` (optional) is the name of the file generated. By default, the name of the template is taken

`destination_path` is the directory where files will be generated

`files` are templates to use to generate files. You can indicate an extension, a filename or a path relative to the template directory


To generate a template :

```
    node ./workflow {{ template }} {{ name }}
```

Exemple:

```
    node ./workflow section MySectionName
```
    
You can use `npm`directly

```    
    npm run template section MySectionName
```
