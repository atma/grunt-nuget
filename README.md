# grunt-nuget

Create nuget package with grunt.

## Getting Started

Since this module is for personal use it is not listed in [npm][npmjs] repository. Please add the next code to your package.json file

```javascript
"devDependencies": {
    "grunt-nuget": "git://github.com/atma/grunt-nuget.git"
}
```

Then install [grunt-nuget ][grunt_nuget] with: `npm install`

And add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-nuget');
```

[grunt]: http://gruntjs.com/
[npmjs]: https://npmjs.org/
[grunt_nuget]: http://github.com/atma/grunt-nuget

## Nuget task
_Run this task with the `grunt nuget` command._

Task targets and files may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Parameters

#### server
Type: `String`
Repository server url to push to.

#### apikey
Type: `String`
API key associated with your account on a remote server. If you use official repository please go to [nuget.org](http://nuget.org/) and register an account. Once you do that, click on "My Account" to see an API Key that was generated for you.

#### publish
Type: `Bool`
Publish automatically?

#### dependencies
Type: `Array`
An array of package dependencies where `id` is an unique package id registered on the server and `version` is a [nuget version](http://docs.nuget.org/docs/reference/versioning) reference.

#### pkgIdentity
Type: `String`
Since nuget package name will be generated automatically using `pkg.name` and `pkg.version` from your [package.json](http://package.json.nodejitsu.com/) file, you can generate unique packages suffixed by `.pkgIdentity`. Do not forget to specify a `pkg` in your `gruntfile`. Ex: `pkg: 'grunt.initConfig({ <json:package.json>', ...`.


### Usage Examples

```javascript
nuget: {
  local: {
    files: [
      {
        src: ['dist/**'],
        dest: 'content/Content/'
      }
    ]
  },
  publish: {
    files: [
      {
        src: ['src/**'],
        dest: 'src/'
      }
    ],
    server: 'http://your.local.repo/',
    apikey: 'nuget-apikey',
    publish: true,
    pkgIdentity: 'Sources',
    dependencies: [
     {
       id: 'jquery', version: '[1.7,1.9)'
     }
    ]
  }
}
```
This will create two nuget packages in nuget_packages directory. The second will be published automatically to repository indicated by `server` param.

_Note: Win32 only_

## License
Copyright (c) 2013 Oleh Burkhay  
Licensed under the MIT license.
