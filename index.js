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

var vaadinElements = ['vaadin-grid', 'vaadin-combo-box', 'vaadin-icons', 'vaadin-upload', 'vaadin-date-picker', 'vaadin-core-elements', 'vaadin-charts'];

function cloneGitRepository(url, targetFolder) {
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
      // Show the path, sha, and filesize in bytes.
      console.log(blob.entry.path() + blob.entry.sha() + blob.rawsize() + "b");

      // Show a spacer.
      console.log(Array(72).join("=") + "\n\n");

      // Show the entire file.
      console.log(String(blob));
    })
    .catch(function(err) {
      console.log(err);
    });
}

program
  .command('init <element>')
  .action(function(element) {
    if (vaadinElements.indexOf(element) > -1) {
      cloneGitRepository('https://github.com/vaadin/' + element + '.git', './' + element);
    } else {
      console.log("Element not found. Use vaadin-elements -h");
    }
  });

program.parse(process.argv);
