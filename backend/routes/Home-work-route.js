const profile = require("express").Router();

const ProfileSchema = require("../schemas/Home-work-schema");
// const { response } = require("express");


// Create new profile
profile.post("/add-new-profile", (req, res, next) => {

  const newProfile = new ProfileSchema({

    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    age: req.body.age,
    gender: req.body.gender,

      favoriteBands: {
        band1: req.body.favoriteBands.band1,
        band2: req.body.favoriteBands.band2,
        band3: req.body.favoriteBands.band3
       

      }
  });

  

  newProfile.save().then((returnProfile) => {
      res.status(201).json({
          
          messageWrapper: {
              message: "Profile created, what do you want? a cookie?",
              messageType: "sucess"
          },
          returnProfile
          
      });
    })
      .catch((err) => {
          res.status(400).json({
              
              messageWrapper: {
                  message: 'Ops, seems you fucked up',
                  messageType: 'error',
                  error: err
              }
          
          
      });
      
  });
});


// Find the user by ID
profile.get('/find-profile/:userId', (req, res, next) => {
    const userId = req.params.userId;
    ProfileSchema.findById(userId)
      .then((profile) => {
        if (!profile || profile.length == 0) {
          res.status(404).json({
            messageWrapper: {
              message: 'user ' + userId + ' not found ',
              messageType: 'error'
            }
          });
        } else {
          res.status(200).json({
            messageWrapper: {
              message: 'user found successfully with the id ' + userId,
              messageType: 'success'
            }
          });
        }
      })
      .catch((err) => {
        res.status(400).json({
          messageWrapper: {
            message: 'there seems to be an error, please try again later.',
            messageType: 'error'

          },
          err
        });
      });
});


// Get ALL profiles
profile.get('/get-all-profiles', (req, res, next) => {
  ProfileSchema.find({}).then((profile) => {
    res
      .status(302)
      .json({
        messageWrapper: {
          message: 'found all profiles',
          messageType: 'success'
        },
        profile
      });
    })
      .catch((err) => {
        res.status(400).json({
          messageWrapper: {
            message: 'cannot find any profiles',
            messageType: 'error',
            error: err
          },
          err
        });
      });
});


// Delete a user by ID
profile.delete('/delete-user-by-id/:userId', (req, res, next) => {
  const userId = req.param('userId'); 
  ProfileSchema.findByIdAndDelete(userId)
    .then((profile) => {
      if ( !profile || profile.lenght == 0) {
      res.status(404).json({
        messageWrapper: {
          message: 'user profile not found',
          messageType: 'error'
        }
      });
    } else {
      res.status(302).json({
        messageWrapper: {
          message: 'user profile deleted',
          messageType: 'success'
        },
        profile
        
      });
      
    }
    })
    .catch((err) => {
      res.status(400).json({
        messageWrapper: {
          message: 'there seems to be an error, please try again later.',
          messageType: 'error'

        },
        err
      });
    });
  });




   profile.get('/find-userprofile-by-name', (req, res, next) => {
   const firstName = req.param('firstName');

  console.log(firstName);
  console.log(lastName);
  if (!firstName && !lastName) {
    res.status(400).json({
      message: 'no users defined, please make sure you send in the right data'
    });
  } else if (!firstName) {
    ProfileSchema.find({ lastName: { $regex: new RegExp("^" + lastName.toLowerCase(), "i") } })
      .then((resp) => {
        res.send(resp);
        next();
      })
      .catch((err) => {
        res.send(err);
        next();
      });
  } else if (!lastName) {
    ProfileSchema.find({ firstName: { $regex: new RegExp("^" + firstName.toLowerCase(), "i") } })
      .then((resp) => {
        res.send(resp);
        next();
      })
      .catch((err) => {
        res.send(err);
        next();
      });
  } else {
    ProfileSchema.find({ firstName: firstName, lastName: lastName })
      .then((resp) => {
        res.send(resp);
        next();
      })
      .catch((err) => {
        res.send(err);
        next();
      });
  }
});


// Uppdate the user profile
profile.put('/update-user-profile/:userId', (req, res, next) => {

  const userId = req.params.userId;
  
      const updateProfile = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        age: req.body.age,
        gender: req.body.gender,
    
          favoriteBands: {
            band1: req.body.favoriteBands.band1,
            band2: req.body.favoriteBands.band2,
            band3: req.body.favoriteBands.band3
          }
  
      };

      const options = {
          new: true
      };

      ProfileSchema.findByIdAndUpdate(userId, updateProfile, options)

      .then((profile) => {
        if (!profile || profile.length == 0) {
          res.status(404).json({
              messageWrapper: {
              message: 'there seems to be a problem, please try again later!',
              messageType: 'error'
              },
          });

        } else {
          res.status(302).json({
              messageWrapper: {
                  message: 'information uppdated successfully ' + profile._id,
                  messageType: 'success'
              },
              profile

            
          });
        }
      })
      .catch((err) => {
          res.status(400).json({
              messageWrapper: {
                  message: 'there seems to be a problem, please try again later!',
                  messageType: 'error'
              },
              err
          });
      });
  });


// delete by parmeter
profile.delete('/delete-by-name', (req, res, next) => {
  const lastName = req.param('lastName');
  ProfileSchema.deleteMany({ lastName: { $regex: new RegExp("^" + lastName.toLowerCase(), "i") } })
    .then((response) => {
      if(response.deletedCount == 0 ){
      res.status(417).send({
        messageWrapper: {
          message: " No account with the name " + lastName + " to delete ",
          messageType: 'not found'
        },
        data: {
         deletedCount: response.deletedCount,
         operationTime: response.operationTime
        } 
      });
    }
    else if(response.deletedCount !== 0){
      res.status(301).send({
        messageWrapper: {
          message: 'Users yeeted!',
          messageType: 'success'
        },
        data: {
         deletedCount: response.deletedCount,
         operationTime: response.operationTime
        }
      });
      }
    })
    .catch((err) => {
      res.status(400).json({
        messageWrapper: {
          message: 'there seems to be an error, plese try agian later',
          messageType: 'error'
        },
        err
      })
    });
  });

module.exports = profile;