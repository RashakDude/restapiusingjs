let fs = require('fs');

const FILE_NAME = './assets/colors.json';

let colorRepo = {
    get: function (resolve, reject) {
        fs.readFile(FILE_NAME, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(JSON.parse(data));
            }
        })
    }
}

module.exports = colorRepo;