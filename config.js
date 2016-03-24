module.exports = function(env) {
  switch(env) {
    case "production": 
      return {
        PORT: 8123,
        BASE_DIRECTORY: __dirname
      };
    case "development":
    default:
      return {
        PORT: 8123,
        BASE_DIRECTORY: __dirname
      };
  }
};