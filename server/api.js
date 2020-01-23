/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Frame = require("./models/frame");
const Project = require("./models/project")
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
s3 = new AWS.S3({apiVersion: '2006-03-01'});
var uploadParams = {Bucket: 'wholesome-heavies', Key: '', Body: ''};
var fs = require('fs');
// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socket = require("./server-socket");

function doesUserExist(user) {
  var bucketParams = {
    Bucket : 'wholesome-heavies',
    Key: "users/" + user._id
  };
  s3.headObject(bucketParams, function(err, data) {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
}

router.post("/login", auth.login);//, (req,res) => {
  // console.log("test");
  // const bucketFolder = {
  //   Bucket : 'wholesome-heavies',
  //   Key: "users/" + req.user._id
  // }
  // s3.headBucket({Bucket:bucketFolder},function(err,data){
  //   if(err){
  //       s3.createBucket({Bucket:bucketFolder},function(err,data){
  //           if(err){ throw err; }
  //           console.log("Bucket created");
  //       });
  //    } else {
  //        console.log("Bucket exists and we have access");
  //    }
  // });
//});
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});



router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socket.addUser(req.user, socket.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// anything else falls to this "not found" case
router.post("/sendFrame", auth.ensureLoggedIn, (req, res) => {
  var buf = __dirname+"/flip_logo_small.png";//new Buffer(uri, 'base64');
  const fs = require("fs");
  var fileStream = fs.createReadStream(buf);
  //console.log(fileStream);
  uploadParams.Body = fileStream;
  const newFrame = new Frame({ 
    user: req.user._id,
    projectId: req.body.project,
    link: null,
  });
  
  newFrame.save().then((frame) => {
    const link = req.user._id + "/" + req.body.project + "/" + frame._id + ".png";
    uploadParams.Key = link
    console.log(uploadParams);
    newFrame.link = link
    console.log(frame._id);
    newFrame.save().then((frame) => console.log(frame._id));
    s3.upload (uploadParams, function (err, data) {
      console.log("test");
      if (err) {
        console.log("Error", err);
      } if (data) {
        //res.send(data.Location)
        console.log("Upload Success", data.Location);
      }
    });
    res.send(frame._id)
  });
})

router.post("/newProject", auth.ensureLoggedIn, (req, res) => {
    const newProject = new Project({
      name: req.body.name,
      user: req.user._id,
    });
    newProject.save().then((project) => res.send(project));
})

router.post("/fileToS3", auth.ensureLoggedIn, (req, res) => {
    uploadParams.Body = req.body.buffer;
    var path = require('path');
    id = "abcd";
    uploadParams.Key = id;
    s3.upload (uploadParams, function (err, data) {
      if (err) {
        console.log("Error", err);
      } if (data) {
        res.send(data.Location)
        console.log("Upload Success", data.Location);
      }
    });
})

router.get("/getFrames", (req,res) => {
  Frame.find({ user: req.user._id, projectId: req.query.project }).then((frames) => {
    //res.send([req.user._id, req.query.project, frames]);
    var links = frames.map((frame) => {
      return frame.link
    });
    var streams = links.map((link) => {
      params = {
        Bucket: 'wholesome-heavies',
        Key: link,
      }
      return s3.getObject(params).createReadStream()
    })
    
    res.send(streams)
  });
})


router.get('/getProjects', (req,res) => {
  Project.find({ user: req.user._id}).then((projects) => {
    var len = projects.length
    console.log(len)
    res.send(projects)
  })
})

router.get("/getNumProjects", (req, res) => {
  Project.find({ user: req.user._id }).then((projects) => {
    var len = projects.length
    console.log(len)
    res.send({len})});
})


router.get("/validateProjectName", (req,res) => {
  Project.find({ user: req.user._id }).then((projects) => {
    var temp = projects.filter((project) => {
      return project.name === req.query.name
    });
    if (temp.length > 0) {
      res.send(false);
    }
    else {
      res.send(true);
    }
  });
})


router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
