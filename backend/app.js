const express = require("express");


require('dotenv').config();
require("./dbconfig/database");
const app = express();
const port = process.env.port || 3000;


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/profile", require("./routes/Home-work-route"));
app.use("/test", require("./routes/test-route"));
app.use('/auth', require('./routes/auth-routes'));


app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
