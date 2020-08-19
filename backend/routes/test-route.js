const router = require('express').Router();

const Profile = require('../schemas/userProfileSchema');
const { response } = require('express');
const profile = require('./Home-work-route');

router.post('add-profile', (req, res, next) => {
    const newProfile = new Profile({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        avatarUrl: req.body.avatarUrl,
        socialLinks: {
            facebookLink: req.body.socialLinks.facebookLink,
            twitterLink: req.body.socialLinks.twitterLink
        }

    });

    newProfile.save().then((profile) => {
        res
        .status(200)
        .json({
            messageWrapper: {
                message: 'user profile create sucessfully',
                messageType: 'sucess'
            },
            profile
        })
        .catch((err) => {
            res.status(400).json({
                messageWrap: {
                    message: 'something went wrong, please try again later',
                    messageType: 'error',
                    error: err
                }
            });
        });
    });
});

router.get('/find-user', (req,res,next) => {
    let userId = req.param('userId');

    Profile.findById(userId)
    .then((profile) => {
        res.status(200).json({
            messageWrapper: {
                message: 'user profile found with the id' + userId,
                messageType: 'sucess'

            },
            profile
        });
    })
    .catch((err) => {
        res.status(400).json({
            messageWrapper: {
                message: 'cannot find user with the id ' + userId,
                messageType: 'error',
                error:err
            }
        });
    });
});

router.get('/get-all-users', (req, res, next) => {
    Profile.find({}).then((profile) => {
        res
        .status(200)
        .json({
            messageWrapper: {
                message: 'found all user',
                messageType: 'sucess'
            },
            profile
        })
        .catch((err) => {
            res.status(400).json({
                messageWrapper: {
                    message: 'cannot find user with the id ' + userId,
                    messageType: 'error',
                    error: err
                }
            });
        });
    });
});


// idag 08-07


router.get("/find-user-by-name", (req, res, next) => {
    const firstName = req.param('firstname');

  Profile.find({ firstName: firstName })
      .then((profile) => {


        if (!profile || profile.lenght == 0) {
            res.status(404).json({
                messageWrapper: {
                    message: ' user ' + firstName + ' does not exists in the database',
                    messageType: 'error'
                }
        });

        } else {
          res.satus(200).json({
              messageWrapper: {
                  message: 'user found with the name: ' + firstName,
                  messageType: 'sucess'
              },
              profile
          });
        }
      })
      .catch((err) => {
          res.status(400).json({
              messageWrapper: {
                  message: 'there is an error, please try again later',
                  messageType: 'error'
              },
              err
          });
      });
  });

  
  
 

  router.delete('/delete-user-by-id', (req, res, next) => {
      const userId = req.params.userId;
      Profile.findByIdAndDelete(serId)

      .then((profile) =>{

      if (!profile || profile.length == 0) {
          res.send(404).json({
              messageWrapper: {
                message: 'user ' + userId + 'not found',
                messageType: 'error'
              }
          });

      } else {
      res.status(200).json({
          messageWrapper: {
              message: 'user deleted successfully with the id ' + profile._id,
              messageType: 'success'
          }
        
      });
    }
})
      .catch((err) => {
          res.status(400).json({
              messageWrapper: {
                  message: ' there seems to be an wrror, please try again later! ',
                  messageType: 'error'
              }
          })
      });
      
  })


  router.post('update-user-profile', (req, res, next) => {

    const userId = req.params.userId;
    
        const updateProfile = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            gender: req.body.gender,
            avatarUrl: req.body.avatarUrl,
            socialLinks: {
                facebookLink: req.body.socialLinks.facebookLink,
                twitterLink: req.body.socialLinks.twitterLink
            }
    
        };

        const options = {
            new: true
        };

        Profile.findByIdAndUpdate(userId, updateProfile, options)
        .then((profile) => {
            res.status(200).json({
                messageWrapper: {
                message: 'User profile information uppdated successfully',
                messageType: 'success'
                },
                profile
            });
        })
        .catch((error) => {
            res.status(400).json({
                messageWrapper: {
                    message: 'there seems to be a problem, please try again later!',
                    messageType: 'error'
                },
            })
        });
    });

  


module.exports = router;
      