'use strict';

var request = require('request');
var webpack = require('webpack');
var path = require('path');
var _ = require('lodash');
var webpackConfig = require("./webpack.config.js");

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  grunt.loadNpmTasks('grunt-jsxhint');
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'index.js'      }
    },
    copy:  {
      html: {
        nonull: true,
        cwd: './src/',
        src: './**/*.html',
        dest: './dist/',
        expand: true
      },
      lib: {
        nonull: true,
        src: './lib/**/*',
        dest: './dist',
        expand: true
      },
    },
    sass: {
      options: {
          sourcemap: true
      },
      dist: {
          files: {
              'dist/css/all.css': 'src/sass/all.scss'
          }
      }
    },
    webpack: {
      options : webpackConfig,
      dev: {}
    },
    "webpack-dev-server": {
      options: {
        keepalive: true,
        port: 2001,
        webpack: webpackConfig,
        contentBase: {target: "http://localhost:2002/"},
        publicPath: "/" + webpackConfig.output.publicPath,
        hot: true
      },
      start: {
        webpack: {
            devtool: "eval",
            debug: true,
            entry: _.mapValues(webpackConfig.entry, function(value) {
              return ["webpack-dev-server/client?http://localhost:2001",
                      "webpack/hot/dev-server",
                     "!style!css!./dist/css/all.css"].concat(value);
            }),
            plugins: webpackConfig.plugins.concat(
              [new webpack.HotModuleReplacementPlugin()]
            )
        }
      }
    },
    watch: {
      sass: {
        files: ['src/**/*'],
        tasks: ['sass']
      },
      html: {
        files: ['src/**/*.html'],
        tasks: ['copy']
      }
    },
    shell: {
      server: {
        command: 'PORT=2002 node index.js'
      }
    },
    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      watch: {
        tasks: ['shell:server', 'webpack-dev-server', 'watch']
      }
    }

  });

  grunt.registerTask('default', ['copy', 'sass', 'concurrent:watch']);
  grunt.registerTask('build', ['copy', 'webpack', 'sass']);
};
