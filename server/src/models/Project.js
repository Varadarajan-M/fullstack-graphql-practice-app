const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	clientId: { type: mongoose.Types.ObjectId, ref: 'Client', required: true },
	name: { type: String, required: true, trim: true },
	description: { type: String, required: true, trim: true },
	status: {
		type: String,
		required: true,
		enum: ['In Progress', 'Not Started', 'Completed'],
	},
});

const Project = mongoose.model('Project', schema);

module.exports = Project;
