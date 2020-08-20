const express = require("express");
require('dotenv').config();
require("./dbconfig/database");
const app = express();
const port = process.env.PORT;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/profile", require("./routes/profile-routes"));
app.use("/test", require("./routes/test-route"));
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
