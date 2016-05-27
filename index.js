#!/usr/bin/env node --harmony

var program = require('commander');
var co = require('co');
var prompt = require('co-prompt');
var request = require('superagent');
var chalk = require('chalk');
var ProgressBar = require('progress');
var fs = require('fs');
var RSVP = require('rsvp');
var path = require('path');
var Git = require("nodegit");
var exec = require('child_process').exec;

var vaadinElements = ['vaadin-grid', 'vaadin-combo-box', 'vaadin-icons', 'vaadin-upload', 'vaadin-date-picker', 'vaadin-core-elements', 'vaadin-charts'];


function cloneGitRepository(url, targetFolder) {
  return new Promise(function(resolve, reject) {

    Git.Clone(url, targetFolder)
      // Look up this known commit.
      .then(function(repo) {
        // Use a known commit sha from this repository.
        return repo.getMasterCommit();
      })
      // Look up a specific file within that commit.
      .then(function(commit) {
        return commit.getEntry("README.md");
      })
      // Get the blob contents from the file.
      .then(function(entry) {
        // Patch the blob to contain a reference to the entry.
        return entry.getBlob().then(function(blob) {
          blob.entry = entry;
          return blob;
        });
      })
      // Display information about the blob.
      .then(function(blob) {
        /*
        // Show the path, sha, and filesize in bytes.
        console.log(blob.entry.path() + blob.entry.sha() + blob.rawsize() + "b");

        // Show a spacer.
        console.log(Array(72).join("=") + "\n\n");

        // Show the entire file.
        console.log(String(blob));*/

        resolve("Success");
      })
      .catch(function(err) {
        resolve("Fail");
      });
  });
}

function installDependencies() {
  return new Promise(function(resolve, reject) {
    installNpmDependencies().then(function() {
      installBowerDependencies().then(function() {
        resolve("Success");
      });
    });
  });
}

function installNpmDependencies() {
  console.log("Installing npm dependencies. Please wait...");
  return new Promise(function(resolve, reject) {
    exec('cd vaadin-combo-box/ && npm install', function(error, stdout, stderr) {
      /*console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }*/
      console.log("Npm dependencies installed");
      resolve("Success");
    });
  });
}

function installBowerDependencies() {
  console.log("Installing Bower dependencies. Please wait...");
  return new Promise(function(resolve, reject) {
    exec('cd vaadin-combo-box/ && bower install', function(error, stdout, stderr) {
      console.log("Bower dependencies installed");
      resolve("Success");
    });
  });
}

program
  .command('init <element>')
  .option('-f, --folder <folder>', 'Initialized directory')
  .option('-d, --dependencies', 'Install dependencies')
  .action(function(element, program) {
    var targetFolder = program.folder || element;
    if (vaadinElements.indexOf(element) > -1) {
      cloneGitRepository('https://github.com/vaadin/' + element + '.git', './' + targetFolder).then(function() {
        console.log("Element initialized");
        if (program.dependencies) {
          installDependencies().then(function() {
            console.log("Element is ready to use");
          });
        } else {
          console.log("Run npm install && bower install in " + targetFolder + " directory to install dependencies");
        }
      });
    } else {
      console.log("Element not found. Use vaadin-elements -h");
    }
  });

program.parse(process.argv);
