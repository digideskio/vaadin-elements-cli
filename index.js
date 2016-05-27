#!/usr/bin/env node --harmony

var program = require('commander');
var co = require('co');
var prompt = require('co-prompt');
var request = require('superagent');
var chalk = require('chalk');
var ProgressBar = require('progress');
var fs = require('fs');
var RSVP = require('rsvp');
var jsonfile = require('jsonfile');
var path = require('path');

//var consumerInfo = jsonfile.readFileSync(path.join(__dirname, './consumer.json'));

program
  .arguments('<file>')
  //.option('-u, --username <username>', 'The user to authenticate as')
  //.option('-p, --password <password>', 'The user\'s password')
  //.option('-b, --browser', 'Open the snippet in the system browser')
  .action(function(file) {
    console.log("asd");

  })
  .parse(process.argv);
