const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteBandsSchema = new Schema(
    {
        band1: {
            type: String
        },
        band2: {
            type: String
        },
        band3: {
            type: String
        }
    },
    {_id: false }
);

const userProfileSchema = new Schema(
    {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        phoneNumber: {
            type: Number
        },
        gender: {
            type: String
        },
        age: {
            type: Number
        },

        favoriteBands: FavoriteBandsSchema
     

    }
);


const Profile = mongoose.model('profile', userProfileSchema);
module.exports = Profile;