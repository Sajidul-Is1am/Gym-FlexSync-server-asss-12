require('dotenv').config()
const express = require('express')
const cors = require('cors');
const app = express()
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
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
        const TrainerProfile = client.db("UserCollection").collection("trainerProfile");
        const ApplyedTrainer = client.db("UserCollection").collection("appledTrainer");
        const PackagePlans = client.db("UserCollection").collection("package");
        const UserSelectedPack = client.db("UserCollection").collection("userSelectedPack");


        app.post('/user', async (req, res) => {
            const userInfo = req.body;
            const resuls = await UserCollection.insertOne(userInfo);
            res.send(resuls)
        })
        app.post('/user/subscriber', async (req, res) => {
            const subscriberInfo = req.body;
            const resuls = await UserSubscriber.insertOne(subscriberInfo);
            res.send(resuls)
        })
        // app.post('/user/selectedpack', async(req,res) => {
        //     const seletedInfo = req.body;
        //     const resuls = await UserSelectedPack.insertOne(seletedInfo);
        //     res.send(resuls)
        // })





        app.get('/user/trainerprofile', async (req, res) => {
            const resuls = await TrainerProfile.find().toArray();
            res.send(resuls);
        })

        app.get('/user/trainerprofile/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const resuls = await TrainerProfile.findOne(query);
            res.send(resuls);
        })
        app.get('/user/packages', async (req, res) => {
            const result = await PackagePlans.find().toArray();
            res.send(result)
        })




        app.put('/user/applytrainer', async (req, res) => {
            const email = req.query.email;
            const filter = {
                email: email
            }
            const applyerInfo = req.body;
            const options = {
                upsert: true
            };
            const updateDoc = {
                $set: {
                    fullname: applyerInfo.fullname,
                    email: applyerInfo.email,
                    age: applyerInfo.age,
                    others: applyerInfo.others,
                    week: applyerInfo.week,
                    day: applyerInfo.day,
                    skill: applyerInfo.skill,
                    image: applyerInfo.image,
                },
            };
            const resuls = await ApplyedTrainer.updateOne(filter, updateDoc, options);
            res.send(resuls)
        })
        app.put('/user/selectedpack', async (req, res) => {
            const name = req.query.name;
            const filter = {
                name: name
            }
            const selectedPack = req.body;
            const options = {
                upsert: true
            };
            const updateDoc = {
                $set: {
                    name: selectedPack.name,
                    features: selectedPack.features,
                    facilities: selectedPack.facilities,
                    image: selectedPack.image,
                    joinNowButtonText:selectedPack.joinNowButtonText
                },
            };
            const resuls = await UserSelectedPack.updateOne(filter, updateDoc, options);
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