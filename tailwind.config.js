module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  purge: {
    content: ["./src/**/*.js", "./src/**/*.jsx"],
    options: {
      // TODO: rename all these classes with some string constant
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
