const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer")

module.exports = {
  webpack: {
    // alias: {
    //   react: "preact/compat",
    //   "react-dom/test-utils": "preact/test-utils",
    //   "react-dom": "preact/compat", // Must be below test-utils
    //   "react/jsx-runtime": "preact/jsx-runtime",
    // },
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
