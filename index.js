require('dotenv').config()
const express = require('express')
const cors = require('cors');
const app = express()
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');
const port = process.env.PORT || 5000


// middlewere
app.use(cors());
app.use(express.json())






const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.xq4dm2q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection

        const UserCollection = client.db("UserCollection").collection("user");
        const UserSubscriber = client.db("UserCollection").collection("subscribe");


        app.post('/user', async (req, res) => {
            const userInfo = req.body;
            const resuls = await UserCollection.insertOne(userInfo)
            res.send(resuls)
        })
        app.post('/user/subscriber', async (req, res) => {
            const subscriberInfo = req.body;
            const resuls = await UserSubscriber.insertOne(subscriberInfo)
            res.send(resuls)
        })




        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})