/**
 * COMMON STRUCTOR WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');

// PostCSS plugins
const cssnext = require('postcss-cssnext');
const postcssFocus = require('postcss-focus');
const postcssReporter = require('postcss-reporter');

module.exports = {

  // Add hot reloading in development
  entry: [
    'eventsource-polyfill', // Necessary for hot reloading with IE
    'webpack-hot-middleware/client?path=/structor-dev/a&timeout=2000&overlay=false',
    path.join(process.cwd(), '.structor/src/default.js'), // Start
  ],

  output: {
    path: path.join(process.cwd(), '.structor/desk/__build__'),
    filename: 'bundle.js',
    publicPath: '/structor-dev/__build__'
  },

  module: {
    loaders: [{
      test: /\.js$/, // Transform all .js files required somewhere with Babel
      loader: 'babel',
      exclude: /node_modules/,
      query: {
        presets: ['react-hmre', 'es2015-webpack', 'react', 'stage-0'],
        plugins: [
          'transform-react-remove-prop-types',
          'transform-react-constant-elements',
          'transform-react-inline-elements'
        ]
      },
    }, {
      // Transform our own .css files with PostCSS and CSS-modules
      test: /\.css$/,
      exclude: [/node_modules/, /app\/assets/],
      loader: 'style-loader!css-loader?localIdentName=[local]__[path][name]__[hash:base64:5]&modules&importLoaders=1&sourceMap!postcss-loader',
    }, {
      // Do not transform vendor's CSS with CSS-modules
      // The point is that they remain in global scope.
      // Since we require these CSS files in our JS or CSS files,
      // they will be a part of our compilation either way.
      // So, no need for ExtractTextPlugin here.
      test: /\.css$/,
      include: [/node_modules/, /app\/assets/],
      loaders: ['style-loader', 'css-loader'],
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file-loader',
    }, {
      test: /\.(jpg|png|gif)$/,
      loader: 'file-loader',
    }, {
      test: /\.html$/,
      loader: 'html-loader',
    }, {
      test: /\.json$/,
      loader: 'json-loader',
    }, {
      test: /\.mp4$/,
      loader: 'url?limit=10000&mimetype=video/mp4',
    }, {
      test: /\.webm$/,
      loader: 'url?limit=10000&mimetype=video/webm',
    }],
  },

  plugins: [

    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      // make fetch available
      fetch: 'exports?self.fetch!whatwg-fetch',
    }),

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    })

  ],

  // Process the CSS with PostCSS
  postcss: () => [
    postcssFocus(), // Add a :focus to every :hover
    cssnext({ // Allow future CSS features to be used, also auto-prefixes the CSS...
      browsers: ['last 2 versions', 'IE > 10'], // ...based on this browser list
    }),
    postcssReporter({ // Posts messages from plugins to the terminal
      clearMessages: true,
    })
  ],

  resolve: {
    modules: ['app', 'node_modules'],
    extensions: [
      '',
      '.js',
      '.jsx',
      '.react.js',
    ],
    packageMains: [
      'jsnext:main',
      'main',
    ]
  },

  // Emit a source map for easier debugging
  devtool: 'cheap-module-eval-source-map',
  target: 'web', // Make web variables accessible to webpack, e.g. window
  stats: false, // Don't show stats in the console
  progress: true

};
