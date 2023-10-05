const fs = require('fs');
const path = require('path');
const NewmanConfig = require('../src/main.js')

const reportDirectories = [NewmanConfig.ALLURE_REPORT_PATH,
NewmanConfig.NEWMAN_JSON_REPORT_PATH,
NewmanConfig.HTML_NEWMAN_REPORT_PATH];

function removeReportDirectories(directories) {
    for (let directory of directories) {
        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            // Exclude files end with .keep
            for (let file of files) {
                if (file != '.keep') {
                    fs.unlink(path.join(directory, file), err => {
                        if (err) throw err;
                    });
                }
            }
            console.log(`\x1b[32m${directory} is removed \u2713\x1b[0m`);
        });
    }
}

removeReportDirectories(reportDirectories);