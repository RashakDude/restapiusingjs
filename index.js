// Bring in the express server and create application
let express = require('express');
let app = express();

// Import data 
let pieRepo = require('./repos/pieRepo');
let colorRepo = require('./repos/colorRepo');

// Use the express Router object
let router = express.Router();

// Create GET to return a list of all the pies
// It is a good practice to pass the JSON object
// Which contains status code and status message
router.get('/pies', function(req, res, next) {
    pieRepo.get(function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "All pies retreieved",
            "data" : data
        });
    }, function(err) {
        next(err);
    });
});

// Create GET respoonse to fetch list of colors from JSON file
router.get('/colors', function(req, res, next) {
    colorRepo.get(function (data) {
        res.status(200).json({
            "status": 200,
            "statusText": "OK",
            "message": "All colors retreieved",
            "data" : data
        });
    }, function(err) {
        next(err);
    });
});

// Get a single pie using /pies/{pie_id}
router.get('/pies/:id', function(req, res, next) {
    pieRepo.getByID(req.params.id, function(data) {
        if (data) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": "Single pie retrieved",
                "data": data
            });
        } else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not found",
                "message": "The pie '" + req.params.id + "' could not be found",
            });
        }
    }, function(err) {
        next(err);
    });
});

// Configure router so all routes are prefixed with /api/v1
app.use('/api/', router);

var server = app.listen(5000, function () {
    console.log('Node server is running on http://localhost:5000');
});