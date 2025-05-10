const express = require("express")
const { ObjectId, MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());


let client;
const initializeDBAndServer = async () => {
    const username = encodeURIComponent("sumanth");
    const password = encodeURIComponent("San@1214");

    const uri = `mongodb+srv://${username}:${password}@cluster0.d6k2z.mongodb.net/`;

    client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB.....");
        app.listen(3000, () => {
            console.log('Server running on port: 3000');
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

initializeDBAndServer();

app.get('/', async (request, response) => {
    try {
        const collection = client.db('creditSea').collection('verificationData'); 
        const result = await collection.find().toArray();
        response.status(200)
        response.send(result);
    } catch (error) {
        response.status(500)
        response.send({ "Internal server error:": error });
    }
});

app.post('/AppForm', async (request, response) => {
    try {
        const collection = client.db('creditSea').collection('verificationData');
        const {name, Loan, Reason, address, LoanINMOnths, status} = request.body
        const alreadyEmailIN = await collection.insertOne({name: name, Loan: Loan, Reason: Reason, address: address, LoanINMOnths: LoanINMOnths, status: status});
        response.status(200)
        response.send("Successfully updated");
    } catch (error) {
        response.status(500)
        response.send({ "Internal server error:": error });
    }
});
