module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  purge: {
    content: ["./src/**/*.js", "./src/**/*.jsx"],
    options: {
      whitelistPatterns: [
        /^row\-span.*/,
        /^row\-start.*/,
        /^col\-span.*/,
        /^col\-start.*/,
        /^key\-info\-connect.*/,
      ],
    },
  },
};
