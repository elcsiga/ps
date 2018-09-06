import {Collection, Db, MongoClient, ObjectId} from 'mongodb';

export async function setupDb(reset: boolean = false) {

    const client = await MongoClient.connect('mongodb://localhost:27017',  { useNewUrlParser: true });
    console.log('Connected to mongoDB');

    const db: Db = client.db('ps');
    const Projects: Collection = db.collection('projects');

    if (reset) {
        Projects.drop();
    }

    const c = await Projects.find({}).count();
    if (c > 0) {
        console.log('Projects found in db:', c);
    } else {
        const result = await Projects.insertMany(new Array(10).fill(true).map((v,i) => ({name: `Project #${i}`})));
        console.log('Projects added in db:', result.insertedCount);
    }

    return db;
}
