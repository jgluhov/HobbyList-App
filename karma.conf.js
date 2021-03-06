// Karma configuration
// Generated on Thu Feb 01 2018 15:10:54 GMT+0300 (MSK)

const webpackConfig = require('./config/webpack.test');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'source-map-support', 'fixture'],

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true,
    },

    webpackServer: {
      noInfo: true,
    },

    // list of files / patterns to load in the browser
    files: [
      'src/spec.ts',
      'src/**/**/*.spec.ts'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/spec.ts': ['webpack'],
      'src/**/**/*.spec.ts': ['webpack']
    },

    mime: {
      'text/x-typescript': [
        'ts'
      ]
    },

    plugins: [
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-source-map-support'),
      require('karma-jasmine'),
      require('karma-spec-reporter'),
      require('karma-html2js-preprocessor'),
      require('karma-fixture'),
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],

    specReporter: {
      maxLogLines: 5,
      suppressErrorSummary: true,
      suppressFailed: false,
      suppressPassed: false,
      suppressSkipped: true,
      showSpecTiming: false,
      failFast: false,
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing
    // tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  });
};
