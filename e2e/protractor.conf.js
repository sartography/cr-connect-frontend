// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

process.env.CHROME_BIN = require('puppeteer').executablePath()

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 60000,
  getPageTimeout: 30000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities: {
    chromeOptions: {
      args: [
        '--headless',
        '--window-size=1440x900',
        '--dev-server-target='
      ],
      binary: process.env.CHROME_BIN
    },
    browserName: 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
