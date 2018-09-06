import {Collection, Db, InsertOneWriteOpResult, ObjectId} from 'mongodb';


export class Names {

    static capitalizeFirstLetter = (s:string) => s.charAt(0).toUpperCase() + s.slice(1);

    constructor(
        public key: string,
        public plural: string = key + 's',
        public add: string = 'add' + Names.capitalizeFirstLetter(key),
    ) {}
}

export class Functions {
    constructor(
        public add = (key, args) => args[key] // e.g. addProject(project: ProjectInput!): Project
    ) {}
}

export class Resolvers {

    private queryResolvers = {};
    private mutationResolvers = {};

    constructor( private db: Db ) {

    }

    private getCollection(name: Names): Collection {
        return this.db.collection(name.plural);
    }

    addListResolver(name: Names) {
        this.queryResolvers[name.plural] = async (obj, args, context, info) => {
            const records = await this.getCollection(name).find({}).toArray();
            return records.map(Resolvers.fromDB);
        };
        return this;
    }

    addEntityResolver(name: Names) {
        this.queryResolvers[name.key] = async (obj, args, context, info) => {
            return Resolvers.fromDB( await this.getCollection(name).findOne( new ObjectId(args.id) ));
        };
        return this;
    }

    addInsertOneResolver(name: Names, functions: Functions) {
        this.mutationResolvers[name.add] = async (obj, args, context, info) => {
            const payload = functions.add(name.key, args);
            const result: InsertOneWriteOpResult = await this.getCollection(name).insertOne(payload);
            return Resolvers.fromDB( result.ops[0] );
        };
        return this;
    }

    addResolvers(name: Names, functions: Functions = new Functions() ) {
        this.addListResolver(name);
        this.addEntityResolver(name);
        this.addInsertOneResolver(name, functions);
        return this;
    }

    static fromDB(obj) {
        return {
            ...obj,
            id: obj._id.toString()
        }
    }

    getResolvers() {
        return {
            Query: this.queryResolvers,
            Mutation: this.mutationResolvers
        }
    }

}
