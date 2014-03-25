module.exports.devJs = [
  'src/js/nameSpace.js',
  'src/js/initChildNameSpaces.js',
  'src/js/core/common/*.js',
  'src/js/core/integration/*.js',
  'src/js/core/tools/*.js',
  'src/js/core/definitions/*.js',
  'src/js/core/db/*.js',
  'src/js/dom/metadata/*.js',
  'src/js/dom/nodes/*.js',
  'src/js/dom/nodes/elements/*.js',
  'src/js/legos/**/*.js',
  'src/js/compositions/querybuilder/sql/*.js',
  'src/js/compositions/querybuilder/*.js',
  'src/js/actionlogic/*.js'
];

module.exports.devCss = ['src/css/**/*.css'];

module.exports.images = ['src/img/**/*.*'];

module.exports.testJs = [
  'src/js/nameSpace.js',
  'src/js/initChildNameSpaces.js',
  'src/js/core/definitions/*.js',
  'src/js/core/common/*.js',
  'src/js/core/integration/*.js',
  'src/js/core/tools/*.js',
  'src/js/dom/metadata/*.js',
  'src/js/dom/nodes/*.js',
  'src/js/dom/nodes/elements/*.js',
  'src/js/legos/**/*.js',
  
  'test/*.js', 
  'test/*/*.js'
];

module.exports.vendorJs = [
    'vendor/js/**/*.js'
];

module.exports.vendorCss = [
    'vendor/css/**/*.css'   
];