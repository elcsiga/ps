import * as express from 'express';
import * as graphql from 'express-graphql';
import * as cors from 'cors';
import {setupDb} from './db';
import {makeExecutableSchema} from 'graphql-tools';
import {typeDefs} from './graphql/typedefs';
import {setupResolvers} from "./graphql/resolvers";
import {testDB} from "./test";

setupDb()
    .then(db => {

        const schema = makeExecutableSchema({
            typeDefs: typeDefs,
            resolvers: setupResolvers(db)
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

        testDB(db, app);

    })
    .catch(error => console.log('DB error', error));


