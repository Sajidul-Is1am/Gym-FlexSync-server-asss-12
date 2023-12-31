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
        const ClassesCollection = client.db("UserCollection").collection("Classes");


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
        app.get('/classes', async (req, res) => {
            const resuls = await ClassesCollection.find().toArray();
            res.send(resuls)
        })
        app.get('/classes/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const resuls = await ClassesCollection.findOne(query)
            res.send(resuls)
        })
         app.get('/dashboard/subscriber', async (req, res) => {
             const resuls = await UserSubscriber.find().toArray();
             res.send(resuls)
         })
        app.get('/dashboard/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const resuls = await UserCollection.findOne(query);
            res.send(resuls)
        })
        app.get('/dashboard/users', async (req, res) => {
            const resuls = await UserCollection.find().toArray()
            res.send(resuls)
        })
        app.get('/dashboard/appliedtrainer', async (req, res) => {
            const resuls = await ApplyedTrainer.find().toArray()
            res.send(resuls)
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
        // google login
        app.put('/user', async (req, res) => {
            const email = req.query.email;
            const filter = {
                email: email
            }
            const googleInfo = req.body;
            const options = {
                upsert: true
            };
            const updateDoc = {
                $set: {
                    email:googleInfo.email,
                    image:googleInfo.photoURL,
                    username:googleInfo.displayName,
                },
            };
            const resuls = await UserCollection.updateOne(filter, updateDoc, options);
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
        app.patch('/dashboard/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = {
                email : email
            }
            const options = {
                upsert: true
            };
            const updateDoc = {
                $set: {
                    role:"admin"
                }
            }
            const resuls = await UserCollection.updateOne(filter, updateDoc, options)
            res.send(resuls)
        })

        app.patch('/dashboard/trainer/:email', async (req, res) => {
            
            const email = req.params.email;
            const filter = {
                email:email
            }
          
            const updateDoc = {
                $set: {
                    role:"trainer"
                }
            }
            const trainer = await ApplyedTrainer.updateOne(filter, updateDoc)
            if (trainer) {
                const query = {
                    email: email
                }
                const user = await UserCollection.findOne(query);
                const updateRole = {
                    $set:{
                        role:'trainer'
                    }
                }
                const reuls = await UserCollection.updateOne(user, updateRole);
                res.send(reuls);
            }


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