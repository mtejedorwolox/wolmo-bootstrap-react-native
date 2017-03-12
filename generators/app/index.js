const Generator = require('yeoman-generator');

const reactNativeCliInstall = require('./tasks/reactNativeCliInstall')
const reactNativeInit = require('./tasks/reactNativeInit');
const installDependencies = require('./tasks/installDependencies');
const appSetup = require('./tasks/appSetup');
const gitInitialization = require('./tasks/gitInitialization')

class ReactNativeBootstrap extends Generator {

  constructor(args, opts) {
    super(args, opts);

    this.option('verbose', {
      desc: 'Turns on verbose logging',
      alias: 'v',
      type: Boolean,
      default: false
    });

    this.conflicter.force = true;
  }

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What\'s your project name?',
        validate: (val) => val && !/ /.test(val) ? true : 'The project name is required and can\'t contain spaces'
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'What\'s features should this project include?',
        choices: [ 'Login', 'Tabs', 'Drawer', 'Push Notifications' ],
        filter: (values) => {
          return values.reduce((answer, val) => {
            answer[val.replace(/ /g, '').toLowerCase()] = true;
            return answer;
          }, {});
        }
      }
    ]).then((answers) => {
      this.projectName = answers.name;
      this.features = answers.features;
    });
  }

  configuring() {
    return Promise.resolve().then(() => {
      return reactNativeCliInstall(this.options);
    }).then(() => {
      return reactNativeInit(this.projectName, this.options)
    }).then(() => {
      return installDependencies(this.projectName, this.options)
    });
  }

  writing() {
    appSetup.bind(this)();
  }

  end() {
    return gitInitialization.bind(this)();
  }
};

module.exports = ReactNativeBootstrap;
