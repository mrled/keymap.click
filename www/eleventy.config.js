const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

const draftsPlugin = require("./eleventy.plugin.drafts.js");
const demosPlugin = require("./eleventy.plugin.demos.js");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy({ public: "/" });
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(draftsPlugin);
  eleventyConfig.addPlugin(demosPlugin);
};
