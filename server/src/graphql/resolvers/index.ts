import {Functions, Names, Resolvers} from "./resolver";
import {Db} from "mongodb";


export function setupResolvers(db: Db): any {

    const resolvers = new Resolvers(db);

    resolvers.addResolvers(
        new Names('project'),
        new Functions()
            .set('insertPayload', (args) => ({ ...args.project, participants: [] }) ),
        'CRUDL'
    );

    resolvers.addResolvers(
        new Names('partner'),
        new Functions()
            .set('insertPayload', (args) => ({ ...args.partner, participants: [], users: [] }) ),
        'CRUDL'
    );

    resolvers.addResolvers(
        new Names('user'),
        new Functions()
            .set('insertPayload', (args) => ({ ...args.user, partnerId: args.partnerId }) ),
        'CRUDL'
    );

    resolvers.addJoin(
        new Names('partner'),
        new Names('user')
    );

    resolvers.addResolvers(
        new Names('participant'),
        new Functions()
            .set('insertPayload', (args) => ({ ...args.participant, projectId: args.projectId, partnerId: args.partnerId, documents: [] }) ),
        'CRUDL'
    );

    resolvers.addJoin(
        new Names('project'),
        new Names('participant')
    );

    resolvers.addJoin(
        new Names('partner'),
        new Names('participant')
    );

    return resolvers.getResolvers();
}
