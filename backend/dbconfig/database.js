const connectionString = require('./connectionString');
const mongoose = require('mongoose');


mongoose
.connect(
    connectionString.mongoose.connectionString,
    connectionString.mongoose.options
)
.catch((err) => {
    console.log(err);
});

const db = mongoose.connection;
db.on('connected', () => {
    console.log(',mongo db connect');
}).on('error', (err) => {
    console.log(`there is an error ${err}`);
});