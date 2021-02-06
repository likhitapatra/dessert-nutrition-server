const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const cors = require('cors');

// Some fake data
let nutritionData = [
  {
    dessert: 'Oreo',
    nutritionInfo: {
      calories: 437,
      fat: 18,
      carb: 63,
      protein: 4,
    },
  },
  {
    dessert: 'Nougat',
    nutritionInfo: {
      calories: 360,
      fat: 19,
      carb: 9,
      protein: 37,
    },
  },
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { nutritionData: [NutritionData] }
  type NutritionData { dessert: String, nutritionInfo: NutritionInfo }
  type NutritionInfo {  calories: Int, fat: Int, carb: Int, protein: Int }
  type Mutation {
    addNutritionData(dessert: String!, calories: Int, fat: Int, carb: Int, protein: Int ): NutritionData
    deleteNutritionData(dessert: String! ): Boolean
  }
`;

// The resolvers
const resolvers = {
  Query: { nutritionData: () => nutritionData },
  Mutation: {
    addNutritionData: (root, args) => {
      const newData = {
        dessert: args.dessert,
        nutritionInfo: {
          calories: args.calories,
          fat: args.fat,
          carb: args.carb,
          protein: args.protein,
        },
      };
      nutritionData.push(newData);
      return newData;
    },
    deleteNutritionData: (root, args) => {
      nutritionData = nutritionData.filter(
        (returnableObjects) => returnableObjects.dessert !== args.dessert
      );
      return true;
    },
  },
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = express();
app.use(cors());

// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});
