const router = require('express').Router();
const verifyToken = require('./verifyToken');
const Profile = require('../schemas/userProfileSchema');

router.post('/edit-profile', verifyToken, async (req, res, next) => {
 
  const userId = req.user.userId;
  const user = await Profile.findOne({ userId });

  if (!user) {
    const newProfile = new Profile({
      userId: req.user.userId,
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
    newProfile
      .save()
      .then((data) => {
        res.status(200).json({
          messageWrapper: {
            message: 'user profile created successfully',
            messagType: 'success'
          },
          data
        });
      })
      .catch((err) => {
        res.status(400).json({
          messageWrapper: {
            message: 'something went wrong, please try again soon.',
            messageType: 'error'
          },
          err
        });
      });
  } else {
    res.json({
      messageWrapper: {
        message:
          'the user already exists, please try again with another account',
        messageType: 'error'
      }
    });
  }
});

router.put('/update-profile', verifyToken, async (req, res, next) => {
  const userId = req.user.userId;
  const user = await Profile.findOne({ userId });
  
  if (!user)
    return res.status(400).json({
      messageWrapper: {
        message: 'no user found with userid',
        messageType: 'error'
      }
    });
   
  const userName = user.userName;
  const updateProfile = {
    userId: req.user.userId,
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
  Profile.findOneAndUpdate(userId, updateProfile, options)
  .then((profile) => {
    if (!profile || profile.length == 0) {
      res.send(404).json({
        messageWrapper: {
          message: 'user ' + userId + 'not found',
          messageType: 'error'
        },

      });
    } else {
      res.status(200).json({
        messageWrapper: {
          message: 'user updated successfully with the id ' + profile._id,
          messageType: 'success'
        },
        profile
      });
    }
  })
  .catch((error) => {
    res.status(400).json({
      messageWrapper: {
        message: ' there seems to be an error, please try again soon',
        messageType: 'error'
      }
    });
  });
});

router.get('/find-profile', verifyToken, (req, res, next) => {
  const userId = req.user.userId;
  Profile.findOne({ userId })
    .then((data) => {
      res.status(200).json({
        messageWrapper: {
          message: ' user profile data retrieved successsfully',
          messageType: 'success'
        },
        data
      });
    })
    .catch((err) => {
      res.status(400).json({
        messageWrapper: {
          message: 'no user found, please try again later',
          messageType: 'error'
        },
        err
      });
    });
});

router.get('/get-all-profiles', (req, res, next) => {
  
   Profile.find({})
    .then((data) => {
      res.status(200).json({
        messageWrapper: {
          message: ' user profile data retrieved successsfully',
          messageType: 'success'
        },
        data
      });
    })
    .catch((err) => {
      res.status(400).json({
        messageWrapper: {
          message: 'no user found, please try again later',
          messageType: 'error'
        },
        err
      });
    });
});

router.delete('/delete-user-profile', verifyToken, (req, res, next) => {
  const userId = req.user.userId; 
  Profile.findOneAndDelete({ userId }) 
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

module.exports = router;