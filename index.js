const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// user: dbUser2
// pass : lHLS5R9sDwb6ItpG



const uri = "mongodb+srv://dbUser2:lHLS5R9sDwb6ItpG@cluster0.hlsud.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('nodeMongoCrud').collection('crudUsers');

        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        });
        // get user by id
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user)
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user);
            res.send(result)
        });

        //update
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const user = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, option);
            res.send(result)
        })

        // for delete
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('trying to delete ', id);
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result)
        });

    }
    finally {

    }
};
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('hello from node mongo crud server')
});

app.listen(port, () => {
    console.log(`listening to port on ${port}`)
})
