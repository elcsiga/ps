import {
    Collection,
    Db,
    FindAndModifyWriteOpResultObject, FindOneAndReplaceOption,
    InsertOneWriteOpResult,
    ObjectId
} from 'mongodb';

export const capitalizeFirstLetter = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export class Names {


    constructor(
        public key: string,
        public type: string = capitalizeFirstLetter(key),
        public collection: string = key + 's',
        public list: string = key + 's',
        public add: string = 'add' + capitalizeFirstLetter(key),
        public update: string = 'update' + capitalizeFirstLetter(key),
        public remove: string = 'remove' + capitalizeFirstLetter(key),
    ) {
    }
    set(key, name: string) {
        this[key] = name;
        return this;
    }
}

export class Functions {
    constructor(
        public insertPayload = (args, key: string) => args[key], // e.g. addProject(project: ProjectInput!): Project
        public updatePayload = (args, key: string) => ({ $set: args[key]})
    ) {
    }

    set(key, fn: any) {
        this[key] = fn;
        return this;
    }
}

export class Resolvers {

    private resolvers = {
        Query: [],
        Mutation: []
    };

    constructor(private db: Db) {

    }

    private getCollection(name: Names): Collection {
        return this.db.collection(name.collection);
    }
    static idQuery(args: any, idFiledName = '_id'): Object { return {[idFiledName]: new ObjectId(args.id)} }
    static idQueryS(args: any, idFiledName = '_id'): Object { return {[idFiledName]: args.id} }

    addListResolver(name: Names) {
        this.resolvers.Query[name.list] = async (/* obj, args,  context, info */) => {
            const records = await this.getCollection(name).find({}).toArray();
            return records.map(Resolvers.fromDB);
        };
        return this;
    }

    addEntityResolver(name: Names) {
        this.resolvers.Query[name.key] = async (obj, args /*, context, info */) => {
            const query = Resolvers.idQuery(args);
            return Resolvers.fromDB(await this.getCollection(name).findOne( query ));
        };
        return this;
    }

    addInsertResolver(name: Names, functions: Functions) {
        this.resolvers.Mutation[name.add] = async (obj, args /*, context, info */) => {
            const payload = functions.insertPayload(args, name.key);
            const result: InsertOneWriteOpResult = await this.getCollection(name).insertOne(payload);
            return Resolvers.fromDB(result.ops[0]);
        };
        return this;
    }

    addUpdateResolver(name: Names, functions: Functions) {
        this.resolvers.Mutation[name.update] = async (obj, args /*, context, info */) => {
            const query = Resolvers.idQuery(args);
            const payload = functions.updatePayload(args, name.key);
            const options: FindOneAndReplaceOption = { returnOriginal: false };
            const result: FindAndModifyWriteOpResultObject = await this.getCollection(name)
                .findOneAndUpdate(query, payload, options);
            return Resolvers.fromDB(result.value);
        };
        return this;
    }

    addRemoveResolver(name: Names) {
        this.resolvers.Mutation[name.remove] = async (obj, args /*, context, info */) => {
            const query = Resolvers.idQuery(args);
            const result: FindAndModifyWriteOpResultObject = await this.getCollection(name).findOneAndDelete(query);
            return Resolvers.fromDB(result.value);
        };
        return this;
    }

    addJoin(one: Names, many: Names, foreignKey = `${one.key}Id` ) {


        // children list
        this.resolvers[one.type] = this.resolvers[one.type] || {};
        this.resolvers[one.type][many.list] = async (obj, args /*, context, info */) => {
            const query = Resolvers.idQueryS(obj, foreignKey);
            const records = await this.getCollection(many).find(query).toArray();
            return records.map(Resolvers.fromDB);
        };

        // parent object
        this.resolvers[many.type] = this.resolvers[many.type] || {};
        this.resolvers[many.type][one.key] = async (obj, args /*, context, info */) => {
            const query = {_id: new ObjectId(obj[foreignKey])};
            const result = await this.getCollection(one).findOne(query);
            return Resolvers.fromDB(result);
        };

        return this;
    }

    addResolvers(name: Names, functions: Functions = new Functions(), types: string = 'CRUDL') {
        if (types.includes('L')) {
            this.addListResolver(name);
        }
        if (types.includes('R')) {
            this.addEntityResolver(name);
        }
        if (types.includes('C')) {
            this.addInsertResolver(name, functions);
        }
        if (types.includes('U')) {
            this.addUpdateResolver(name, functions);
        }
        if (types.includes('D')) {
            this.addRemoveResolver(name);
        }
        return this;
    }

    static fromDB(obj) {
        return obj ? {
            ...obj,
            id: obj._id.toString()
        } : null;
    }

    getResolvers(): Object { return this.resolvers; }
}
