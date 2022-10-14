let logRepo = require('../repos/logRepo');

let errorHelpers = {
    logErrorsToConsole: function (err, req, res, next) {
        console.error("Log Entry: " + JSON.stringify(errorHelpers.err));
        console.error("*".repeat(100));
        next(err);
    },

    logErrorsToFile: function (err, req, res, next) {
        let errorObject = errorHelpers.errorBuilder(err);
        errorObject.requestInfo = {
            "hostname": req.hostname,
            "path": req.path,
            "app": req.app
        }
        logRepo.write(errorObject, function (data) {
            console.log(data);
        }, function (err) {
            console.error(err);
        });
        next(err);
    },

    clientErrorHandler: function (err, req, res, next) {
        if(req.xhr) {
            res.status(500).json({
                "status": 500,
                "statusText": "Internal Server Error",
                "message": "XMLHttpRequest error"
            });
        } else {
            next(err);
        }
    },

    errorHandler: function(err, req, res, next) {
        res.status(500).json(errorHelpers.errorBuilder(err));
    },

    errorBuilder: function(err) {
        return {
            "status": 500,
            "statusText": "Internal Server Error",
            "message": err.message,
            "Error Number": err.errno,
            "Error call": err.syscall
        };
    }
}

module.exports = errorHelpers;