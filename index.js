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

        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).send('Invalid job ID');
            }
            const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
            res.send(job);
            console.log(job)
        });

        app.post('/jobs', async (req, res) => {
            const newJob = req.body
            const result = await jobsCollection.insertOne(newJob);
            res.send(result);
            console.log(result)
        });

        app.put('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const updatedJob = req.body;
            delete updatedJob._id;
            try {
                const result = await jobsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updatedJob }
                );
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: error.message });
            }
        });

        app.delete('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            try {
                const result = await jobsCollection.deleteOne({ _id: new ObjectId(id) });
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: error.message });
            }
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




