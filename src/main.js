const newman = require('newman');
const axios = require('axios');
const fs = require('node:fs');


const GLOBALS_FILE = './globals/workspace.postman_globals.json';
const CREDS_FILE = './creds/creds.json';

class NewmanConfig {

    static NEWMAN_JSON_REPORT_PATH = './reports/json/';
    static HTML_NEWMAN_REPORT_PATH = './reports/html/';
    static REPORT_OPTIONS = ['cli', 'json', 'html'];

    constructor(arg_feed_file_path) {

        let run_list = require(arg_feed_file_path).collections;

        const setting_global_vars = new Promise((resolve, err)=>{
            let global_data = JSON.parse(fs.readFileSync(GLOBALS_FILE, 'utf8'));
            let creds = JSON.parse(fs.readFileSync(CREDS_FILE, 'utf8'));
            for(let i = 0; i < Object.keys(creds).length; i++){
                axios.post("https://auth.unionetest.ru/api/v1/signin", {
                    phone: Object.values(creds)[i].phone,
                    password: Object.values(creds)[i].password
                })
                .then(function (response) {
                    console.log(response.data.values);
                    global_data.values[i].value = response.data.values[0]
                })
                .finally(()=>{
                    fs.writeFileSync(GLOBALS_FILE, JSON.stringify(global_data));
                });
                
            }
            resolve("Done")           
        }).then((somestring)=>{
            console.log(somestring)
            run_list.forEach((item, index) => {
                // console.log("\x1b[34mCollection " + index + ":\x1b[0m");
                // console.log(item);
                NewmanConfig.runCollection(item.collection, item.environment, item.global);
            });
        });

        
    }

    static runCollection(collection, environment, globals) {
        let file_name = collection.split("/");
        let options = {
            collection: require(collection),
            globals: GLOBALS_FILE,
            reporters: NewmanConfig.REPORT_OPTIONS,
            reporter: {
                html: {
                    export: NewmanConfig.HTML_NEWMAN_REPORT_PATH.concat(file_name[file_name.length - 1]).concat('.html')
                },
                json: {
                    export: NewmanConfig.NEWMAN_JSON_REPORT_PATH.concat(file_name[file_name.length - 1]).concat('.json')
                }
            }
        };

        if (!environment == undefined) {
            options.environment = require(environment);
        }

        if (!globals == undefined) {
            options.global = require(global);
        }

        
        newman.run(options, function (err) {
            if (err) { throw err; }
            console.log(`\x1b[34m==> ${collection} is finished \u235f\x1b[0m`);
        });
        
    }
}

module.exports = NewmanConfig