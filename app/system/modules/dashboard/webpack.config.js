let VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = [{
    entry: {
        "index": "./app/views/index"
    },
    output: {
        filename: "./app/bundle/[name].js"
    },
    module: {
        rules: [
            {test: /\.vue$/, use: 'vue-loader'}
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}];
