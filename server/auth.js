const { OAuth2Client } = require("google-auth-library");
const User = require("./models/user");
const socket = require("./server-socket");
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// create a new OAuth client used to verify google sign-in
//    TODO: replace with your own CLIENT_ID
const CLIENT_ID = "138590269458-igi3p1ocb4ppiuems5in3v987jtq8uam.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// accepts a login token from the frontend, and verifies that it's legit
function verify(token) {
  return client
    .verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })
    .then((ticket) => ticket.getPayload());
}

// gets user from DB, or makes a new account if it doesn't exist yet
function getOrCreateUser(user) {
  // the "sub" field means "subject", which is a unique identifier for each user
  return User.findOne({ googleid: user.sub }).then((existingUser) => {
    if (existingUser) return existingUser;

    const newUser = new User({
      name: user.name,
      googleid: user.sub,
    });

    return newUser.save();
  });
}
//mongo will save the structure then store a link to it
function login(req, res) {
  verify(req.body.token)
    .then((user) => getOrCreateUser(user))
    .then((user) => {
      // persist user in the session
      req.session.user = user;
      // console.log("step1");
      // const bucketFolder = {
      //   Bucket : "basjksdnla",
      //   //Key: "wholesome-heavies",
      // };
      // console.log("before");
      // s3.headBucket(bucketFolder, (err,data) => {
      //   console.log(err, " ", data);
      //   if(err){
      //     console.log("dne")
      //       s3.createBucket(bucketFolder, function(err,data){
      //           if(err){ throw err; }
      //           console.log("Bucket created");
      //       });
      //    } else {
      //        console.log("Bucket exists and we have access");
      //    }
      // });
      //console.log(bucketFolder.Key)
      res.send(user);
    })
    .catch((err) => {
      console.log(`Failed to log in: ${err}`);
      res.status(401).send({ err });
    });
}

function logout(req, res) {
  req.session.user = null;
  res.send({});
}

function populateCurrentUser(req, res, next) {
  // simply populate "req.user" for convenience
  req.user = req.session.user;
  next();
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ err: "not logged in" });
  }

  next();
}

module.exports = {
  login,
  logout,
  populateCurrentUser,
  ensureLoggedIn,
};
