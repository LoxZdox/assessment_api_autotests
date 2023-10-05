const newmanConfig = require('./src/main.js');

// Validate input arguments
if (process.argv.length <= 2) {
    console.log("\x1b[31mPlease provide path to the feed file\nEx: '../feeds/feed.json'\x1b[0m")
} else {
    var args = process.argv.slice(2);
    new newmanConfig(args[0], "--reporter-cli-no-console", "--reporter-cli-no-banner");
}