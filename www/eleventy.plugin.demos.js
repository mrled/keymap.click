/* Handle demo posts in Eleventy
 *
 * Adapted from <https://github.com/11ty/eleventy-base-blog/blob/main/eleventy.config.drafts.js>
 *
 * Mark a post as a demo by setting `demo: true` in the front matter.
 * Then it will not be processed unless the environment variable `BUILD_DEMOS` is set.
 */

function eleventyComputedPermalink() {
  console.log(`BUILD_DEMOS: ${process.env.BUILD_DEMOS}`);
  return (data) => {
    if (data.demo && !process.env.BUILD_DEMOS) {
      return false;
    }
    return data.permalink;
  };
}

function eleventyComputedExcludeFromCollections() {
  return (data) => {
    if (data.demo && !process.env.BUILD_DEMOS) {
      return true;
    }
    return data.eleventyExcludeFromCollections;
  };
}

module.exports.eleventyComputedPermalink = eleventyComputedPermalink;
module.exports.eleventyComputedExcludeFromCollections =
  eleventyComputedExcludeFromCollections;

module.exports = (eleventyConfig) => {
  eleventyConfig.addGlobalData(
    "eleventyComputed.permalink",
    eleventyComputedPermalink,
  );
  eleventyConfig.addGlobalData(
    "eleventyComputed.eleventyExcludeFromCollections",
    eleventyComputedExcludeFromCollections,
  );
};
