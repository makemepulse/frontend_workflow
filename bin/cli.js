#!/usr/bin/env node

require('jake');
require('./../lib/workflow');

jake.run.apply(jake, process.argv.slice(2));