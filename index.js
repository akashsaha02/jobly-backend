const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 4000;


// MongoDB Database Connection

const uri = process.env.MONGO_URI;
console.log(uri);

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        await client.connect();
        console.log("Connected to the server");
        const database = client.db("jobly");
        const jobsCollection = database.collection("jobs");
        // const donatationCollection = database.collection("donations");

        app.get('/jobs', async (req, res) => {
            const jobs = await jobsCollection.find().toArray();
            res.send(jobs);
        });

        app.post('/jobs', async (req, res) => {
            const newCampaign = req.body
            const result = await jobsCollection.insertOne(newCampaign);
            res.send(result);
        });


        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }

    catch (error) {
        console.log(error);
    }
}
run().catch(console.dir);




