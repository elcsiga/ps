import * as express from 'express';
import * as graphql from 'express-graphql';
import * as cors from 'cors';
import {setupDb} from './db';
import {makeExecutableSchema} from 'graphql-tools';
import {typeDefs} from './graphql/typedefs';
import {Names, Resolvers} from "./graphql/resolvers";

setupDb()
    .then(db => {

        const resolvers = new Resolvers(db)
            .addResolvers(new Names('project'))
            .getResolvers();

        const schema = makeExecutableSchema({
            typeDefs: typeDefs,
            resolvers: resolvers
        });

        // SERVER

        const app = express();

        app.use(cors());

        app.use(
            '/graphql',
            graphql({
                schema: schema,
                graphiql: true
            })
        );

        const port = 3000;
        console.log(`Listening on ${port}`);
        app.listen(port);

    })
    .catch(error => console.log('DB error', error));


