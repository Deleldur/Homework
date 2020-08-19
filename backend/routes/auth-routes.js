const auth = require('express').Router();
const bcrypt = require('bcrypt');
const Login = require('../schemas/authSchema');
const Tokens = require('../schemas/tokens-Schema');
const jwt = require('jsonwebtoken');
const { route } = require('./Home-work-route');
const verifyToken = require('./verifyToken');
const nodemailer = require('nodemailer');


auth.post('/register', async (req, res, next) => { 
  const userName = req.body.userName,
  userPassword = req.body.userPassword;
  
  const user = await Login.findOne({ userName });
  if (!user) {
  const saltRounds = 10;
  
  bcrypt.hash(userPassword, saltRounds).then(function(hash) {
      const newLogin = new Login({
          userName: userName,         
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
  
  auth.post('/email', async (req, res, next) => {

   let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure:false,
      tls: {
        rejectUnauthorized: false
      },

      auth: {
          user: process.env.EMAIL_SERVER_EMAIL, 
          pass: process.env.EMAIL_SERVER_PASSWORD 
      },
      debug: true, 
      logger: true 
    });

  let info = await transporter.sendMail({
    from: '"James Öhrberg" <Jim.orberg@gmail.com>',
    to: "jasmin.padberg85@ethereal.email",
    subject: "Test email", 
    text: "This is the actual text in the email",
});

  res.status(200).json({
    messageWrapper: {
      message: 'Email sent',
      messageType: 'success'
    },
    info
  })
  .catch((err) => {
    res.status(400).json({
      messageWrapper: {
        message: 'Sorry, could not send the email',
        messageType: 'error',
        error: err
      }
    });
  });

  next();
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
        { expiresIn: "10m"}
        );
    return authToken;
  }

  module.exports = auth;