module.exports = {
  webpack: {
    configure: {
      entry: {
        main: './src/main.ts',
        index: './src/index.js',
      },
      output: {
        filename: '../demo-vault/.obsidian/plugins/obsidian-macros/[name]/[name].js',
      },
      externals: {
        obsidian: 'obsidian',
      },
      devtool: 'inline-cheap-source-map',
      optimization: {
        runtimeChunk: false,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // vendor chunk
          },
        },
      },
    },
  },
}
