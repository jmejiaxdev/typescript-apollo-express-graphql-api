# Creating a basic TypeScript configuration

## Setting up the project

Create a new folder for the project and create a package.json file with the help of the CLI.

```bash
mkdir typescript-apollo-express-graphql-api
cd typescript-apollo-express-graphql-api
npm init --yes
```

## Install & Initialize TypeScript

Install Typescript and generate a `tsconfig.json` file using `npx`. We will also need `nodemon` to compile our code on change, and ts-node to exec TypeScript files.

```bash
npm i typescript nodemon ts-node --save-dev
npx tsc --init --rootDir src --outDir dist --lib dom,es6 --module commonjs --removeComments
```

## Hello World 👋 with a TypeScript configuration

Create a `/src` directory with a `server.ts` file.

```bash
mkdir src && cd src && touch server.ts
```

Put some content in that file for testing purpose

```ts
// server.ts
console.log("Hey 👋");
```

Last step is to adjust scripts in the `package.json` file as below:

```json
"scripts": {
  "start:dev": "npm run build:dev",
  "build:dev": "nodemon src/server.ts --exec ts-node src/server.ts -e ts,graphql"
}
```

With that, you should be able to type `npm run start:dev` in your terminal to start `nodemon` and see our `console.log`. Nodemon should also recompile if you change the code in the `server.ts` file.

# Setting up Express, Apollo and creating a simple GraphQL API

## Installing moar dependencies

```bash
npm i apollo-server-express compression cors express graphql http ncp
npm i @types/compression @types/express @types/graphql @types/graphql-depth-limit @types/node graphql-depth-limit graphql-import graphql-import-node --save-dev
```

## Creating the Apollo Server with basic options

Change the content of `server.ts` to this:

```ts
import express from "express";
import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import depthLimit from "graphql-depth-limit";
import cors from "cors";
import compression from "compression";
import { createServer } from "http";

const app = express();
const server = new ApolloServer({
  schema,
  validationRules: [depthLimit(7)],
});
app.use("*", cors());
app.use(compression());
server.applyMiddleware({ app, path: "/graphql" });
const httpServer = createServer(app);
httpServer.listen({ port: 3000 }, (): void =>
  console.log("\n🚀 GraphQL is now running on http://localhost:3000/graphql")
);
```

## Creating GraphQL schema and resolvers

First, let’s create our GraphQL Schema. In the `/src` folder, create a `/schema` folder and 1 file inside: `schema.graphql`.

```bash
mkdir schema && cd schema && touch schema.graphql
```

Declare a Query type in it:

```graphql
// schema.graphql
type Query {
  helloWorld: String!
}
```

Then let’s quickly create a `resolverMap` file in the `/src` folder:

```bash
cd ../ && touch resolverMap.ts
```

```ts
// resolverMap.ts
import { IResolvers } from "graphql-tools";

const resolverMap: IResolvers = {
  Query: {
    helloWorld(_: void, args: void): string {
      return "👋 Hello world! 👋";
    },
  },
};

export default resolverMap;
```

Finally create a schema file in the `/src` folder that will be in charge of making an Executable GraphQL Schema:

```bash
touch schema.ts
```

```ts
// schema.ts
import "graphql-import-node";
import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import * as typeDefs from "./schema/schema.graphql";
import resolvers from "./resolverMap";

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
```

Adjust the script in your package.json file as below:

```json
"scripts": {
  "start": "node 'dist/server.js'",
  "build": "tsc -p . && ncp src/schema dist/schema",
  "start:dev": "npm run build:dev",
  "build:dev": "nodemon src/server.ts --exec ts-node src/server.ts -e ts,graphql"
}
```

# Run the code

Running `npm run build` in your terminal will compile your code and put it in the `/dist` folder. You can run the compiled code with `npm start.`

## GraphQL sample

```graphql
query allCourses {
  helloWorld
}
```
