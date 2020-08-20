const express = require('express');
require('dotenv').config();
const port = process.env.AUTH_PORT;
const app = express();
require('./dbconfig/database');
app.use(express.urlencoded({ extende: false }));
app.use(express.json());
app.use('/auth', require('./routes/auth-routes'));
app.listen(port, () =>
console.log(`Example app listening at http://localhost:${port}`)
);