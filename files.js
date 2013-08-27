module.exports.devJs = [
  'app/js/nameSpace.js',
  'app/js/initChildNameSpaces.js',
  'app/js/core/common/*.js',
  'app/js/core/integration/*.js',
  'app/js/core/tools/*.js',
  'app/js/core/definitions/*.js',
  'app/js/core/db/*.js',
  'app/js/dom/metadata/*.js',
  'app/js/dom/nodes/*.js',
  'app/js/dom/nodes/elements/*.js',
  'app/js/legos/**/*.js',
  'app/js/compositions/querybuilder/sql/*.js',
  'app/js/compositions/querybuilder/*.js',
  'app/js/actionlogic/*.js'
];

module.exports.devCss = ['app/css/**/*.css'];

module.exports.images = ['app/img/**/*.*'];

module.exports.testJs = [
  'app/js/nameSpace.js',
  'app/js/initChildNameSpaces.js',
  'app/js/core/definitions/*.js',
  'app/js/core/common/*.js',
  'app/js/core/integration/*.js',
  'app/js/core/tools/*.js',
  'app/js/dom/metadata/*.js',
  'app/js/dom/nodes/*.js',
  'app/js/dom/nodes/elements/*.js',
  'app/js/legos/**/*.js',
  
  'test/*.js', 
  'test/*/*.js'
];

module.exports.vendorJs = [
    'vendor/js/**/*.js'
];

module.exports.vendorCss = [
    'vendor/css/**/*.css'   
];