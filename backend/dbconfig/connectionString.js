const { options } = require("../routes/test-route");

const connectionString = {
    mongoose: {
        connectionString: `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`,

        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }
};

module.exports = connectionString;