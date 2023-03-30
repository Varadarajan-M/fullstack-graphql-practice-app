const mongoose = require('mongoose');

const connectDb = async () => {
	try {
		mongoose.connect('mongodb://localhost:27017/learn_graphql_db');

		mongoose.connection.on('connected', () => {
			console.log('Connected to Database');
		});
	} catch (e) {
		console.warn('Could not connect to database : Error ->', e.message);
	}
};

module.exports = connectDb;
