/* Handle draft posts in Eleventy
 *
 * Adapted from <https://github.com/11ty/eleventy-base-blog/blob/main/eleventy.config.drafts.js>
 *
 * Mark a post as a draft by setting `draft: true` in the front matter.
 * Then it will not be processed unless the environment variable `BUILD_DRAFTS` is set.
 */

function eleventyComputedPermalink() {
  return (data) => {
    if (data.draft && !process.env.BUILD_DRAFTS) {
      return false;
    }
    return data.permalink;
  };
}

function eleventyComputedExcludeFromCollections() {
  return (data) => {
    if (data.draft && !process.env.BUILD_DRAFTS) {
      return true;
    }
    return data.eleventyExcludeFromCollections;
  };
}

module.exports.eleventyComputedPermalink = eleventyComputedPermalink;
module.exports.eleventyComputedExcludeFromCollections = eleventyComputedExcludeFromCollections;

module.exports = (eleventyConfig) => {
  eleventyConfig.addGlobalData(
    "eleventyComputed.permalink",
    eleventyComputedPermalink
  );
  eleventyConfig.addGlobalData(
    "eleventyComputed.eleventyExcludeFromCollections",
    eleventyComputedExcludeFromCollections
  );
};
