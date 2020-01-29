/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");
ObjectId = require('mongodb').ObjectID;
// import models so we can interact with the database
const User = require("./models/user");
const Frame = require("./models/frame");
const Project = require("./models/project");
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

// function doesUserExist(user) {
//   var bucketParams = {
//     Bucket : 'wholesome-heavies',
//     Key: "users/" + user._id
//   };
//   s3.headObject(bucketParams, function(err, data) {
//     if (err) {
//       return false;
//     } else {
//       return true;
//     }
//   });
// }

router.post("/login", auth.login);
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
/*
Used to send individual canvas octet streams to the aws server and make a mongoBD object of it
input: {
  id: the frame id if it is defined-string, null if it is a new frame]
  project: the name of the project to link it to-string
  stream: the octet stream of the image-string maybe
}
Output: {
  id: MongoDB ObjectID
}
*/
router.post("/sendFrame", auth.ensureLoggedIn, (req, res) => {
  uploadParams.Body = req.body.stream;
  if (req.body.id) {
    Frame.find({ _id: req.body.id }).then((frame) => {
      frame = frame[0];
      console.log("LINK+++++++++++", frame)
      const link = frame.link;//req.user._id + "/" + req.body.project + "/" + frame._id ;//".png";
      uploadParams.Key = link;
      s3.upload (uploadParams, function (err, data) {
        console.log("test");
        if (err) {
          console.log("Error", err);
        } if (data) {
          //res.send(data.Location)
          console.log("Upload Success", data.Location);
        }
      });
      out = {
        id: frame._id,
      };
      res.send(out);
    });
  }
  else {
    const newFrame = new Frame({ 
      user: req.user._id,
      projectId: req.body.project,
      link: null,
    });
    newFrame.save().then((frame) => {
      const link = req.user._id + "/" + req.body.project + "/" + frame._id ;//+ ".png";
      uploadParams.Key = link
      //console.log(uploadParams);
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
      out = {
        id: frame._id,
      };
      res.send(out);
    });
  }
})


/*
Used to create a new project object in MongoDB
input: {name: the name of the project, string}
output: the project object from mongoDB
*/
router.post("/newProject", auth.ensureLoggedIn, (req, res) => {
    const newProject = new Project({
      name: req.body.name,
      user: req.user._id,
    });
    newProject.save().then((project) => res.send(project));
})

/*
I dont think this is used but ill leave it just in case
*/
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

/*
update the order of frames for a specific project
input: {
  project: the name of the project
  order: and array of strings representing the objectIDs of the frames
}
output: the project Object saved in Mongo
*/
router.post("/updateFrameList", auth.ensureLoggedIn, (req,res) => {
  Project.find({ user: req.user._id, name: req.body.project }).then((frameObj) => {
    console.log(frameObj);
    proj = frameObj[0]
    proj.frameOrder = req.body.order;
    proj.save().then((output) => res.send(output))
  });
})


/*
I also dont think this is used 
*/
router.get("/getFrames", (req,res) => {
  Frame.find({ user: req.user._id, projectId: req.query.project }).then((frames) => {
    //res.send([req.user._id, req.query.project, frames]);
    var links = frames.map((frame) => {
      return frame.link
    });
    var streams = links.map((link) => {
      const params = {
        Bucket: 'wholesome-heavies',
        Key: link,
      }
      return s3.getObject(params).createReadStream()
    })
    
    res.send(streams)
  });
})


/*
Gets a specific frame's octet stream
input: {
  idSend: string of the objectID of the frame you want
  project: the project you want the fram from
  sequence: the sequence you want the frame to appear in
}
output: {
  data: the octet stream of the canvas image
  sequence: the order wanted
}
*/
router.get("/getFrame", (req,res) => {
  const frameId = new ObjectId(req.query.idSend);
  Frame.find({ user: req.user._id, projectId: req.query.project, _id: frameId }).then((frame) => {
    frame = frame[0];
    const link = frame.link
    const params = {
      Bucket: 'wholesome-heavies',
      Key: link,
    };
    s3.getObject(params, function(err,data) {
      if (err)
        return err;
      let objectData = data.Body.toString('utf-8');
      const body = {
        data: objectData,
        sequence: req.query.sequence,
      };
      res.send(body);
    });
  });
})

/*
gets all projects for a user
input: nothing
output: {
  all the projects a certain user has
}
*/
router.get('/getProjects', (req,res) => {
  Project.find({ user: req.user._id}).then((projects) => {
    var len = projects.length
    console.log(len)
    res.send(projects)
  })
})


/*
gets the number of projects a user has
input: nothing
output: {number of projects}
*/
router.get("/getNumProjects", (req, res) => {
  Project.find({ user: req.user._id }).then((projects) => {
    var len = projects.length
    console.log(len)
    res.send({len})});
})


/*
gets a certain project 
input: {
  project: the name of the project to fetch
}
output: the project object from mongo, might be in an array so watch out and only get the 0th element if so idrk rn
*/
router.get("/getProject", (req,res) => {
  Project.find({ user: req.user._id, name: req.query.project}).then((project) => {
    res.send(project)
  })
})

/*
makes sure the project name hasnt been taken yet
input: {
  name: the desired name
}
output: true if available, false otherwise
*/
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
