const auth = require('express').Router();
const bcrypt = require('bcrypt');
const Login = require('../schemas/authSchema');
const Tokens = require('../schemas/tokens-Schema');
const jwt = require('jsonwebtoken');
const { route } = require('./Home-work-route');
const verifyToken = require('./verifyToken');
const nodemailer = require('nodemailer');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;


const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: process.env.EMAIL_SERVER_EMAIL,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
});

let message = { 
from: 'Jim.orberg@gmail.com', 
to: 'jasmin.padberg85@ethereal.email',
subject: 'welcome to the jungle',
text: 'this is dummy thicc text that will be read in the actual email',
html: '<p>this is dummy thicc text that will be read in the actual email</p>'
};

auth.post('/send-email', (req,res,next) =>{
  transporter.sendMail(message, (err, info) =>{
    if (err) return res.json({ error: err.message });
    res.json({ response: info.messageId });
    next();
  });
});

auth.post('/forgot-password', async (req, res, next) => {
  const userName = req.body.userName;
  try {
    const user = await Login.findOne({ userName });
    if (!user) {
      return res.status(400).json({
        messageWrapper: {
          message: 'no user found, please make sure your username is correct',
          messageType: 'error'
        }
      });
    } else {
      const passwordResetToken = Math.random().toString(36).slice(-8);

      const update = {
        userName: user.userName,
        userPassword: user.userPassword,
        passwordResetToken
      };

      const option = {
        new: true
      };

      Login.findOneAndUpdate(userName, update, option)
        .then((data) => {
          const toEmail = user.userEmail;

          let message = {
            from: 'jim.orberg@gmail.com',
            to: toEmail,
            subject: 'Reset your password',
            text: ` use this token to reset your password ${passwordResetToken}`,
            html: ` <p>use this token to reset your password <strong>${passwordResetToken}</strong></p>`
          };

          transporter.sendMail(message, (err, info) => {
            // add a message wrapper here for the client
            if (err) return res.json({ error: err.message });

            res.json({
              messageWrapper: {
                message: ' please check your inbox for a reset password token',
                messageType: 'success'
              },
              data
            });
            next();
          });
        })
        .catch((err) => {
          res.send(err);
          next();
        });
    }
  } catch (err) {
    res.send(err);
  }
});

auth.post('/reset-password', async (req, res, next) => {
  const passwordResetToken = req.body.resetToken,
    newPassword = req.body.newPassword;
    
  try {
    const user = await Login.findOne({ passwordResetToken });
    if (!user) {
      return res.json({
        messageWrapper: {
          message: 'no user found, please make sure your username is correct',
          messageType: 'error'
        }
      });
    }
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(newPassword, salt, (err, hash) => {
        const userName = user.userName;

        const update = {
          userPassword: hash,
          passwordResetToken: ''
        };
        const option = {
          new: true
        };

        // res.json({ update });
        Login.findOneAndUpdate(userName, update, option)
          .then((data) => {
            res.status(200).json({
              messageWrapper: {
                message:
                  'your password has successfully been changed. please login',
                messageType: 'success'
              },
              data
            });
          })
          .catch((err) => {
            res.send(err);
          });
      });
    });
    
  } catch (err) {
    res.send(err);
  }
});

auth.post('/register', async (req, res, next) => { 
  const userName = req.body.userName,
  userEmail = req.body.userEmail,
  userPassword = req.body.userPassword;
  
  const user = await Login.findOne({ userName });
  if (!user) {
  const saltRounds = 10;
  
  bcrypt.hash(userPassword, saltRounds).then(function(hash) {
      const newLogin = new Login({
          userName,
          userEmail,    
          userPassword: hash
      });
      newLogin
            .save()
            .then((user) => {
              res.status(200).json({
                messageWrapper: {
                  message: 'user created successfully',
                  messageType: 'success'
                },
                user
              });
            })
            .catch((err) => {
              res.status(500).json({
                messageWrapper: {
                  message: 'something went wrong please try again soon',
                  messageType: 'error'
                },
                err
              });
            });
          });   
    } else {
      res.status(400).json({
        messageWrapper: {
          message: ' user already exists with this email adress',
          messageTypepe: 'error'
        }
      });
    }
  });
  
  auth.post('/login', async (req, res, next) => {
      const userName = req.body.userName,
      userPassword = req.body.userPassword;
  
      const user = await Login.findOne({ userName });
      const hash = user.userPassword;
      const userId = user._id;
  
      bcrypt.compare(userPassword, hash, (err, result) => {
     
        if (result == true) {
          const accessToken= generateAccessToken(userId);
          const refreshToken = jwt.sign(
            {userId},
             process.env.JWT_REFRESH_TOKEN_SECRET);
  
            const refreshTokens = new Tokens({
              token: refreshToken
            });
  
            refreshTokens
            .save()
            .then(() => { 
              res.status(200).json({
                messageWrapper: {
                    message: 'welcome',
                    messageType: 'success'
                  },
                  accessToken,
                refreshToken
            });
            })
            .catch((err) => {
              res.json(err)
            });
            } else {
              res.status(400).json({
                messageWrapper: {
                  message: 'please make sure your credentials are correct',
                  messageType: 'error'
                }
              });
            }
      });
  });
  
  auth.post("/test-token", verifyToken, (req, res, next) => {
    res.json({
      data: req.user.userId
    });
  });
  
  auth.post("/refresh-token", (req, res, next) => {
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
  
    Tokens
    .find({token: refreshToken})
    .then((data) => {

      const refreshToken = data[0].token;
        jwt.verify(
          refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET,(err,user) => { 
          if(err) return res.sendStatus(403);   
          const accessToken = generateAccessToken(user.userId);   
          res.json({ accessToken: accessToken });
        });
      })
      .catch((err) => {
      res.json(err);   
    });
  });
  
  auth.delete('/logout', (req, res, next) => {
    const refreshToken = req.body.token;

    Tokens.findOneAndDelete({ token: refreshToken })
    .then((resp) => {
      jwt.sign({ name: 'expires' }, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '1000'
      });
        res.json({
            messageWrapper:{
                message: "you have logged out.", 
                messageType: "success"
            },
            resp
        });
      })
    .catch((err) => {
        res.json(err);
      });
  });
  
    function generateAccessToken(userId){
    const authToken = jwt.sign(
      { userId },
       process.env.JWT_AUTH_TOKEN_SECRET,
        { expiresIn: "60m"}
        );
    return authToken;
  }

  module.exports = auth;