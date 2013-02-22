/*
 * grunt-nuget
 * https://github.com/atma/grunt-nuget
 *
 * Copyright (c) 2013 Oleh Burkhay
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function(grunt) {

  var utils = grunt.util ||  grunt.utils,
      _ = utils._,
      path = require('path'),
      fs = require('fs'),
      wrench = require('wrench');

  path.sep = path.sep || path.normalize('/');

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('nuget', 'Build nuget package.', function(publish) {
      var helpers = require('grunt-lib-contrib').init(grunt);
      var options = helpers.options(this, {
          basePath: false,
          flatten: false,
          processName: false,
          processContent: false,
          processContentExclude: []
      });

      // TODO: ditch this when grunt v0.4 is released
      this.files = this.files || helpers.normalizeMultiTaskFiles(this.data, this.target);

      var copyOptions = {
          process: options.processContent,
          noProcess: options.processContentExclude
      };

      grunt.verbose.writeflags(options, 'Options');

      var buildTarget = this.target;
      var pkgPath = path.join('nuget_packages', buildTarget) + path.sep;
      // Clean package folder
      if (fs.existsSync(pkgPath)) {
          grunt.verbose.or.write('Cleaning package directory: ' + pkgPath.cyan + '...');
          wrench.rmdirSyncRecursive(pkgPath, false);
          grunt.verbose.or.ok();
      }

      var srcFiles;
      var destType;

      var basePath;
      var filename;
      var relative;
      var destFile;
      var srcFile;

      this.files.forEach(function(file, key) {

          file.dest = path.normalize(path.join(pkgPath, 'files', file.dest));
          srcFiles = grunt.file.expandFiles(file.src);

          if (srcFiles.length === 0) {
              grunt.fail.warn('Unable to copy; no valid source files were found.');
          }

          destType = detectDestType(file.dest);

          if (destType === 'file') {
              if (srcFiles.length === 1) {
                  srcFile = path.normalize(srcFiles[0]);

                  grunt.verbose.or.write('Copying file' + ' to ' + file.dest.cyan + '...');
                  grunt.file.copy(srcFile, file.dest, copyOptions);
                  grunt.verbose.or.ok();
              } else {
                  grunt.fail.warn('Unable to copy multiple files to the same destination filename, did you forget a trailing slash?');
              }
          } else if (destType === 'directory') {
              basePath = helpers.findBasePath(srcFiles, options.basePath);

              grunt.verbose.writeln('Base Path: ' + basePath.cyan);
              grunt.verbose.or.write('Copying files' + ' to ' + file.dest.cyan + '...');

              srcFiles.forEach(function(srcFile) {
                  srcFile = path.normalize(srcFile);
                  filename = path.basename(srcFile);
                  relative = path.dirname(srcFile);

                  if (options.flatten) {
                      relative = '';
                  } else if (basePath && basePath.length >= 1) {
                      relative = _(relative).strRight(basePath).trim(path.sep);
                  }

                  if (options.processName && utils.kindOf(options.processName) === 'function') {
                      filename = options.processName(filename);
                  }

                  // make paths outside grunts working dir relative
                  relative = relative.replace(/\.\.(\/|\\)/g, '');

                  destFile = path.join(file.dest, relative, filename);

                  grunt.file.copy(srcFile, destFile, copyOptions);
              });

              grunt.verbose.or.ok();
          }
      });

      grunt.config.requires('pkg');

      var pkgIdentity = this.data.pkgIdentity;
      var pkgDependencies = this.data.dependencies;
      var files = wrench.readdirSyncRecursive(pkgPath),
          data = {
              pkg: grunt.config.get('pkg'),
              identity: pkgIdentity,
              dependencies: pkgDependencies,
              files: []
          };

      if (!files) {
          grunt.fail.warn('Unable to build package; no valid source files were found.');
      }

      files.filter(function (file) {
          return fs.statSync(path.join(pkgPath, file)).isFile();
      }).forEach(function (file) {
          data.files.push({
              src: file,
              target: file.substr(6) // substr length = 'files' + path.sep
          });
      });

      var pkgName = grunt.template.process('<%= pkg.name %>.<% if(identity) { %><%= identity %>.<% } %><%= pkg.version %>', {identity: pkgIdentity, pkg: grunt.config.get('pkg')});
      var specFile = path.join(pkgPath, pkgName + '.nuspec');
      var pkgFile = path.join(pkgPath, pkgName + '.nupkg');
      var specTpl = grunt.file.read(path.join('node_modules/grunt-nuget/tasks', 'templates', 'spec.tpl'));
      grunt.file.write(specFile, grunt.template.process(specTpl, data));

      var isPublish = this.data.publish,
          _apikey = this.data.apikey,
          _server = this.data.server;
      var terminal = require("child_process").exec,
          nugetPath = fs.realpathSync('node_modules/grunt-nuget/bin/NuGet.exe'),
          buildCmd = nugetPath + " Pack " + specFile + ' -OutputDirectory ' + pkgPath,
          publishCmd = nugetPath + " Push " + pkgFile + ' -Source ' + _server + ' -NonInteractive -ApiKey ' + _apikey;

      var done = this.async();
      grunt.verbose.or.write('Creating package ' + pkgFile.yellow + '...');
      terminal(buildCmd, function(error, stdout, stderr) {
          if (error) {
              grunt.fail.warn('Unable to build package; ' + error);
          }
          grunt.verbose.or.ok();

          if (isPublish) {
              if (!_apikey || !_server) {
                  grunt.fail.warn('Unable to publish package; Please provide an api key and/or server url');
              }

              grunt.verbose.or.write('Pushing package ' + pkgFile.yellow + ' to ' + _server.cyan + '...');
              terminal(publishCmd, function(error, stdout, stderr) {
                  if (error) {
                      grunt.fail.warn('Unable to publish package; ' + error);
                  }
                  grunt.verbose.or.ok();
                  done(true);
              });
          } else {
              done(true);
          }
      });
  });

  var detectDestType = function(dest) {
    if (_.endsWith(dest, path.sep)) {
      return 'directory';
    } else {
      return 'file';
    }
  };
};
