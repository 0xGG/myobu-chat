module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/myobu-chat/" : "/",
  devServer: {
    https: true,
  },
};
