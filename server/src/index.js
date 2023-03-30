const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const connectDb = require('./config/connection');
const graphqlSchema = require('./schema');
const port = 3000;

const app = express();

app.use(
	'/graphql',
	graphqlHTTP({
		schema: graphqlSchema,
		graphiql: true,
	}),
);

connectDb().catch(console.error);

app.listen(port, () => {
	console.log(`Server started on port: ${port}`);
});
