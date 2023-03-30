const {
	GraphQLObjectType,
	GraphQLID,
	GraphQLString,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull,
	GraphQLEnumType,
} = require('graphql');
const Client = require('../models/Client');
const Project = require('../models/Project');

const ClientType = new GraphQLObjectType({
	name: 'client',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		phone: { type: GraphQLString },
	}),
});

const ProjectType = new GraphQLObjectType({
	name: 'projects',
	fields: () => ({
		_id: { type: GraphQLID },
		clientId: { type: GraphQLID },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		status: { type: GraphQLString },
		client: {
			type: ClientType,
			resolve: async (parent) => await Client.findById(parent.clientId),
		},
	}),
});

const RootQuery = new GraphQLObjectType({
	name: 'RootType',
	fields: {
		client: {
			type: ClientType,
			args: { _id: { type: GraphQLID } },
			resolve: async (_, args) => await Client.findById(args._id),
		},

		clients: {
			type: new GraphQLList(ClientType),
			resolve: async (parent, args) => Client.find({}).lean(),
		},

		projects: {
			type: new GraphQLList(ProjectType),
			resolve: async (parent, args) => await Project.find({}).lean(),
		},

		project: {
			type: ProjectType,
			args: { _id: { type: GraphQLID } },
			resolve: async (_, args) => await Project.findById(args._id),
		},
	},
});

const mutations = new GraphQLObjectType({
	name: 'mutations',
	fields: {
		addProject: {
			type: ProjectType,
			args: {
				clientId: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: new GraphQLNonNull(GraphQLString) },
				description: { type: new GraphQLNonNull(GraphQLString) },
				status: {
					type: new GraphQLNonNull(
						new GraphQLEnumType({
							name: 'ProjectStatusENUM',
							values: {
								new: { value: 'Not Started' },
								progress: { value: 'In Progress' },
								completed: { value: 'Completed' },
							},
						}),
					),
				},
			},
			resolve: async (_, args) => await new Project({ ...args }).save(),
		},

		updateProject: {
			type: ProjectType,
			args: {
				_id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: GraphQLString },
				description: { type: GraphQLString },
				status: {
					type: new GraphQLEnumType({
						name: 'UpdateProjectStatusType',
						values: {
							new: { value: 'Not Started' },
							progress: { value: 'In Progress' },
							completed: { value: 'Completed' },
						},
					}),
				},
			},
			resolve: async (_, args) =>
				await Project.findByIdAndUpdate(
					args._id,
					{
						$set: {
							...args,
						},
					},
					{ new: true },
				),
		},

		deleteProject: {
			type: ProjectType,
			args: {
				_id: { type: new GraphQLNonNull(GraphQLID) },
			},
			resolve: async (_, args) => await Project.findByIdAndRemove(args._id),
		},

		addClient: {
			type: ClientType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
				phone: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: async (_, args) => await new Client({ ...args }).save(),
		},

		removeClient: {
			type: ClientType,
			args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
			resolve: async (_, args) => {
				const delProject = await Project.findOneAndDelete({
					clientId: args._id,
				});

				return Client.findByIdAndRemove(args._id);
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: mutations,
});
