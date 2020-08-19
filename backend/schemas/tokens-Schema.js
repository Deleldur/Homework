const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
    {
        token: String
    }
);

const Tokens = mongoose.model('tokens', tokenSchema);
module.exports = Tokens;