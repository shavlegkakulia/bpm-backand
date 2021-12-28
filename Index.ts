import express from "express";
import DotEnv from "dotenv";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import rootValues from "./src/graphql/resolvers/index";
import { IConfigParesd } from "./src/utils/database";
import typeDefs from './src/graphql/typeDefs';
import { makeExecutableSchema } from '@graphql-tools/schema';
import helmet from 'helmet';

const Configs = DotEnv.config() as unknown as IConfigParesd;
const app = express();
const port = Configs.parsed.APP_PORT;

app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const combineSchema = makeExecutableSchema({
  typeDefs,
});

app.use(
  "/graphql",
  graphqlHTTP(async(request) => ({
    schema: combineSchema,
    rootValue: rootValues,
    graphiql: true,
    context: {
      request: request.headers
    },
    customFormatErrorFn(error) {
      console.log("*************************************", error);
      if (!error.originalError) {
        return error;
      }
      // @ts-ignore
      const data = error.originalError.data;
      const message = error.message || "An error ocoured.";
      // @ts-ignore
      const code = error.originalError.code || 500;
      return { extensions: { status: code, data }, message };
    },
  }))
);

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(
    `Running a GraphQL API server at http://localhost:${port}/graphql`
  );
});
