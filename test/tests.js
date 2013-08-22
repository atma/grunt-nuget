'use strict';

var semver = require('semver'),
    grunt = require('grunt'),
    nuget = require('../tasks/nuget.js'),
    convert = nuget._convert;

module.exports = {
    'Can convert empty range to version': function (test) {
        var range = new semver.Range('');
        var conveted = convert(range);
        test.equal(conveted, '');
        test.done();
    },
    'Can convert "specific" version 1-1': function (test) {
        var range = new semver.Range('1.0.0');
        var conveted = convert(range);
        test.equal(conveted, '[1.0.0]');
        test.done();
    },
    'Can convert "specific" version 1-2': function (test) {
        var range = new semver.Range('1.0');
        var conveted = convert(range);
        test.equal(conveted, '[1.0.0, 1.1.0)');
        test.done();
    },
    'Can convert "specific" version 1-3': function (test) {
        var range = new semver.Range('1');
        var conveted = convert(range);
        test.equal(conveted, '[1.0.0, 2.0.0)');
        test.done();
    },
    'Can convert "specific" version 2-1': function (test) {
        var range = new semver.Range('=1.0.0');
        var conveted = convert(range);
        test.equal(conveted, '[1.0.0]');
        test.done();
    }, 
   'Can convert "specific" version 2-2': function (test) {
        var range = new semver.Range('=1.0');
        var conveted = convert(range);
        test.equal(conveted, '[1.0.0, 1.1.0)');
        test.done();
    },   
    'Can convert "specific" version 2-3': function (test) {
        var range = new semver.Range('=1');
        var conveted = convert(range);
        test.equal(conveted, '[1.0.0, 2.0.0)');
        test.done();
    },
    'Can convert "greater than specific" version 1': function (test) {
        var range = new semver.Range('>1.0.0');
        var conveted = convert(range);
        test.equal(conveted, '(1.0.0, )');
        test.done();
    },
    'Can convert "greater than specific" version 2': function (test) {
        var range = new semver.Range('>1.0');
        var conveted = convert(range);
        test.equal(conveted, '[1.1.0, )');
        test.done();
    },
    'Can convert "greater than specific" version 3': function (test) {
        var range = new semver.Range('>1');
        var conveted = convert(range);
        test.equal(conveted, '[2.0.0, )');
        test.done();
    },
    'Can convert "less than specific" version 1': function (test) {
        var range = new semver.Range('<1.0.0');
        var conveted = convert(range);
        test.equal(conveted, '(, 1.0.0)');
        test.done();
    },
    'Can convert "less than specific" version 2': function (test) {
        var range = new semver.Range('<1.0');
        var conveted = convert(range);
        test.equal(conveted, '(, 1.0.0)');
        test.done();
    },
    'Can convert "less than specific" version 3': function (test) {
        var range = new semver.Range('<1');
        var conveted = convert(range);
        test.equal(conveted, '(, 1.0.0)');
        test.done();
    },
    'Can convert "greater than or equal to" version 1': function (test) {
        var range = new semver.Range('>=1.0.0');
        var conveted = convert(range);
        test.equal(conveted, '[1.0.0, )');
        test.done();
    },
    'Can convert "greater than or equal to" version 2': function (test) {
        var range = new semver.Range('>=1.0');
        var conveted = convert(range);
        test.equal(conveted, '[1.0.0, )');
        test.done();
    },
    'Can convert "greater than or equal to" version 3': function (test) {
        var range = new semver.Range('>=1');
        var conveted = convert(range);
        test.equal(conveted, '[1.0.0, )');
        test.done();
    },
    'Can convert "less than or equal to" version 1': function (test) {
        var range = new semver.Range('<=1.0.0');
        var conveted = convert(range);
        test.equal(conveted, '(, 1.0.0]');
        test.done();
    },
    'Can convert "less than or equal to" version 2': function (test) {
        var range = new semver.Range('<=1.0');
        var conveted = convert(range);
        test.equal(conveted, '(, 1.0.0]');
        test.done();
    },
    'Can convert "less than or equal to" version 3': function (test) {
        var range = new semver.Range('<=1');
        var conveted = convert(range);
        test.equal(conveted, '(, 1.0.0]');
        test.done();
    },
    'Can convert "dash range" to version 1': function (test) {
        var range = new semver.Range('1.2.3 - 2.3.4');
        var conveted = convert(range);
        test.equal(conveted, '[1.2.3, 2.3.4]');
        test.done();
    },
    'Can convert "dash range" to version 2': function (test) {
        var range = new semver.Range('1.2 - 2.3');
        var conveted = convert(range);
        test.equal(conveted, '[1.2.0, 2.4.0)');
        test.done();
    },
    'Can convert "dash range" to version 3': function (test) {
        var range = new semver.Range('1 - 2');
        var conveted = convert(range);
        test.equal(conveted, '[1.0.0, 3.0.0)');
        test.done();
    },
    'Can convert "reasonably close" to version 1': function (test) {
        var range = new semver.Range('~1.1.1');
        var conveted = convert(range);
        test.equal(conveted, '[1.1.1, 1.2.0)');
        test.done();
    },    
    'Can convert "reasonably close" to version 2': function (test) {
        var range = new semver.Range('~1.1');
        var conveted = convert(range);
        test.equal(conveted, '[1.1.0, 1.2.0)');
        test.done();
    },
    'Can convert "reasonably close" to version 3': function (test) {
        var range = new semver.Range('~1');
        var conveted = convert(range);
        test.equal(conveted, '[1.0.0, 2.0.0)');
        test.done();
    },
    'Can convert "compatible" version 1': function (test) {
        var range = new semver.Range('^1.2.3');
        var conveted = convert(range);
        test.equal(conveted, '[1.2.3, 2.0.0)');
        test.done();
    },
    'Can convert "compatible" version 2': function (test) {
        var range = new semver.Range('^1.2');
        var conveted = convert(range);
        test.equal(conveted, '[1.2.0, 2.0.0)');
        test.done();
    },
    'Can convert "compatible" version 3': function (test) {
        var range = new semver.Range('^1');
        var conveted = convert(range);
        test.equal(conveted, '[1.0.0, 2.0.0)');
        test.done();
    },
    'Can convert "compatible" version 4': function (test) {
        var range = new semver.Range('^0.0.2');
        var conveted = convert(range);
        test.equal(conveted, '[0.0.2]');
        test.done();
    },

    'Can convert range to version 1': function (test) {
        var range = new semver.Range('>1.0 <=2');
        var conveted = convert(range);
        test.equal(conveted, '[1.1.0, 2.0.0]');
        test.done();
    },
    'Can convert range to version 2': function (test) {
        var range = new semver.Range('>1.0.0 <=2');
        var conveted = convert(range);
        test.equal(conveted, '(1.0.0, 2.0.0]');
        test.done();
    },
    'Can convert range to version 3': function (test) {
        var range = new semver.Range('>=2');
        var conveted = convert(range);
        test.equal(conveted, '[2.0.0, )');
        test.done();
    },
    'Can convert range to version 4': function (test) {
        var range = new semver.Range('<=2 >1.0');
        var conveted = convert(range);
        test.equal(conveted, '[1.1.0, 2.0.0]');
        test.done();
    }
};