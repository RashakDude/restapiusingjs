// Bring in the express server and create application
let express = require('express');
let app = express();

// Import data 
let pieRepo = require('./repos/pieRepo');
let colorRepo = require('./repos/colorRepo');

// Use the express Router object
let router = express.Router();

// Configure middleware to support JSON data
// while parsing in request object
app.use(express.json());

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

// Seach an object using ?params=param.name,id,etc.
router.get('/pies/search', function(req, res, next) {
    let searchObject = {
        "id": req.query.id,
        "name": req.query.name
    };
    pieRepo.search(searchObject, function (data) {
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

// Insert a data to json file
router.post('/pies', function(req, res, next) {
    pieRepo.insert(req.body, function (data) {
        res.status(201).json({
            "status": 201,
            "statusText": "Created",
            "message": "Pie added successfully",
            "data" : data
        });
    }, function(err) {
        next(err);
    });
});

// Updating a data using PUT method
router.put('/pies/:id', function(req, res, next) {
    pieRepo.getByID(req.params.id, function(data) {
        if(data) {
            pieRepo.update(req.body, req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "Updated",
                    "message": "Pie '" + req.params.id + "'updated",
                    "data" : data
                });
            });
        } 
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not found",
                "message": "The pie '" + req.params.id + "' could not be found",
            });
        }
    },function(err) {
        next(err);
    });
});


// Partial updating a data using PATCH method
router.patch('/pies/:id', function(req, res, next) {
    pieRepo.getByID(req.params.id, function(data) {
        if(data) {
            pieRepo.update(req.body, req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "Updated",
                    "message": "Pie '" + req.params.id + "'updated",
                    "data" : data
                });
            });
        } 
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not found",
                "message": "The pie '" + req.params.id + "' could not be found",
            });
        }
    },function(err) {
        next(err);
    });
});

// Deleting a data using DELETE method
router.delete('/pies/:id', function(req, res, next) {
    pieRepo.getByID(req.params.id, function(data) {
        if(data) {
            pieRepo.delete(req.params.id, function (data) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "Deleted",
                    "message": "Pie has been deleted",
                    "data" : "Pie '" + req.params.id + "' deleted"
                });
            });
        } 
        else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not found",
                "message": "The pie '" + req.params.id + "' could not be found",
            });
        }
    },function(err) {
        next(err);
    });
});


// Configure router so all routes are prefixed with /api/v1
app.use('/api/', router);

// Added a personalised error Builder function
function errorBuilder(err) {
    return {
        "status": 500,
        "statusText": "Internal Server Error",
        "message": err.message,
        "Error Number": err.errno,
        "Error call": err.syscall
    };
}

// Configure exception logger
app.use(function(err, req, res, next) {
    console.log(errorBuilder(err));
    next(err);
})

// Configure exception handling middleware at the last
app.use(function(err, req, res, next) {
    res.status(500).json(errorBuilder(err));
});

var server = app.listen(5000, function () {
    console.log('Node server is running on http://localhost:5000');
});