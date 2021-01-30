module.exports = ({
  plugins: [
    require('precss'),
    require('postcss-preset-env')({ stage: 1 }),
    require('autoprefixer'),
    require('cssnano')
  ]
})