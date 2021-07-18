const path = require('path');

module.exports = {
  devServer: {
    writeToDisk: true,
    hot: false,
    inline: false,
    liveReload: false,
  },
  webpack: {
    configure: {
      entry: './src/main.ts',
      output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js',
        libraryTarget: 'commonjs',
      },
      externals: {
        obsidian: 'obsidian',
      },
      devtool: false,
      optimization: {
        minimize: false,
        runtimeChunk: false,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
          },
        },
      },
    },
  },
};
