'use strict'

const fs    = require('fs-extra')
const m     = require('mustache')
const path  = require('path')
const Print = require('../lib/Print')
const Task  = require('../lib/Task')
const paths = require('../config/paths')

/**
 *
 * @type Object
 * @private
 *
 * Regex used to detect the file type
 */
const _regex = {
  html: /html/i,
  js: /(js|es)/i,
  stylus: /(styl|stylus)/i,
  sass: /(sass)/i
}

class Template extends Task {

  execute() {
    super.execute()

    const params = this.parameters
    const argv   = params.argv
    const templateName = argv._[1]
    const dstName      = argv._[2]
    const config = this.getConfig(templateName)

    if (!config) {
      Print.log(`The "${templateName}" template do not have any configuration`, 'yellow')
    }

    const manifest = this._buildManifest(config, templateName, dstName)

    const p = argv._[3] || {}
    p.name = p.name || dstName

    // Generate files from templates
    for (let j = 0; j < manifest.length; j++) {
      const template = fs.readFileSync(manifest[j].inputFile).toString('utf8')
      const output   = m.render(template, p)
      fs.ensureDirSync(path.dirname(manifest[j].outputFile))
      fs.writeFile(manifest[j].outputFile, output)
      Print.log(`${manifest[j].outputFile} generated`, 'green')
    }
  }

  getConfig(templateName) {
    const config = this.parameters
    return config[templateName]
  }

  _buildManifest(config, templateName, dstName) {
    const templatePaths = []

    // Build a manifest from template files
    for (let file, output, pth, i = 0; i < config.files.length; i++) {
      file = config.files[i]

      if (path.dirname(file) === '.') {
        for (let key in _regex) {
          if (file.match(_regex[key])) {

            // Detect a file
            if (path.extname(file).length > 0) {
              pth = [paths.templates_path, key, file]
            }

            // Detect an extension
            else {
              pth = [paths.templates_path, key, templateName + '.' + file]
            }

            break
          }
        }
      }

      // Detect a path
      else {
        pth = [paths.templates_path, file]
      }

      pth = pth.join('/')

      // Override the output name if the config.ouput exists
      output = config.output ? config.output + path.extname(pth) : dstName + path.extname(pth)

      templatePaths.push({
        inputFile: pth,
        outputFile: path.join(config.destination_path, dstName, output)
      })
    }

    return templatePaths
  }

}

Template.description = 'Generate files'

module.exports = Template
