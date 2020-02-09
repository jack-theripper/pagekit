var _ = require('lodash');
var glob = require('glob');
var path = require('path');
var exports = [];

// '{app/modules/**,app/installer/**,app/system/**,packages/**}/webpack.config.js'
// glob.sync('{app/system,app/system/modules/dashboard}/webpack.config.js', {ignore: 'packages/**/node_modules/**'}).forEach(function (file) {
glob.sync('app/system/webpack.config.js', {ignore: 'packages/**/node_modules/**'}).forEach(function (file) {
    let dir = path.join(__dirname, path.dirname(file));
    exports = exports.concat(require('./' + file).map(function (config) {
        return _.merge({context: dir, output: {path: dir}}, config);
    }));
});

module.exports = exports;
