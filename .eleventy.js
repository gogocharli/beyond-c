module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    // Templates:
    'html',
    'njk',
    'md',
    // Static Assets:
    'css',
    'jpeg',
    'jpg',
    'png',
    'svg',
    'woff',
    'woff2',
  ]);
  eleventyConfig.addPassthroughCopy('src/static');
  eleventyConfig.addPassthroughCopy('scripts');

  return {
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    passthroughFileCopy: true,

    dir: {
      input: 'src',
      output: '_output',
      includes: 'includes',
      layouts: 'layouts',
      data: 'data',
    },
  };
};
