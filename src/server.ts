import express, { Express } from "express";
import cors from "cors";
import compression from "compression";
import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import depthLimit from "graphql-depth-limit";
import schema from "./schema";

const createExpressApp = () => {
  const app = express();
  app.use("*", cors());
  app.use(compression());
  return app;
};

const createHttpServer = (app: Express) => {
  const port = 3000;
  const httpServer = createServer(app);
  httpServer.listen({ port }, (): void => console.log("\n🚀 GraphQL is now running on http://localhost:3000/graphql"));
  return httpServer;
};

const createApolloServer = (app: Express) => {
  const path = "/graphql";
  const maxDepthLimit = 7;
  const apolloServer = new ApolloServer({ schema, validationRules: [depthLimit(maxDepthLimit)] });
  apolloServer.applyMiddleware({ app, path });
  return apolloServer;
};

const app = createExpressApp();
createHttpServer(app);
createApolloServer(app);
