const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")

module.exports = {
  webpack: {
    plugins: {
      add: [
        new BundleAnalyzerPlugin({
          analyzerMode:
            process.env.NODE_ENV === "production" ? "static" : undefined,
        }),
      ],
    },
  },
}
