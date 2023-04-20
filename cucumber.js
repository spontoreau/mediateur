module.exports = {
  default:
    'src/**/*.feature --require dist/**/*.js --format @cucumber/pretty-formatter --publish-quiet',
  ci: 'src/**/*.feature --require dist/**/*.js --format summary --publish',
};
