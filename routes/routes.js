var express = require('express');
var router = express.Router();

//bring mongojs
var mongojs = require('mongojs');


//pass my mongoLab database using the driver and choose the collections to use
var db = mongojs('mongodb://portfoliouser:portfolio13@ds237475.mlab.com:37475/portfolio',['Projects']);

console.log(db)
//Get all Projects from db
router.get('/projects', function(req, res, next){
    db.Projects.find(function(err,Projects){ //find in my Database the Project collection
        if(err){
            res.send(err);
        }
    res.json(Projects);
    });
});


//Get single Project from db
router.get('/projects/:id', function(req, res, next){
    db.Projects.findOne({_id:mongojs.ObjectId(req.params.id)},function(err,project){ //find in my Database the Project collection
        if(err){
            res.send(err);
        }
    res.json(project);
    });
});

//POST a new project to db


module.exports = router; //needed to use outside this file