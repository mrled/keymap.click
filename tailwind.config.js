module.exports = {
  content: ["./src/**/*.js", "./src/**/*.jsx"],
  safelist: [
    // TODO: rename all these classes with some string constant
    { pattern: /^row\-span.*/ },
    { pattern: /^row\-start.*/ },
    { pattern: /^col\-span.*/ },
    { pattern: /^col\-start.*/ },
    { pattern: /^key\-info\-connect.*/ },
  ],
};
