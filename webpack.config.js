var path = require('path');

var config = {
    module: {
      loaders: [
        { 
          test: path.join(__dirname+'/src/build', 'es6'),
          loader: 'babel-loader',
          query: {
            "presets": ["es2015"]
          }
        }
      ]      
    },
};
var Config1 = Object.assign({}, config, {
  name: "a",
  entry: "./index.js",
  output: {
    path: __dirname+'/public',
    filename: "bundle.js"
  },
});
module.exports = [
  Config1
];