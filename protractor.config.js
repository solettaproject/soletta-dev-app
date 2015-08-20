exports.config ={
  specs:['test_case/**/*.js'],
  framework:'mocha',
  mochaOpts:{
    reporter:'spec',
    slow:3000,
    enableTimeouts: false
  },
  capabilities:{
    'browserName':'chrome'
  }
};
