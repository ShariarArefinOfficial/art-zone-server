const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uctmuu5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


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
        await client.connect();

        const userCollection=client.db('CraftDb').collection('user');
        const craftCollection=client.db('CraftDb').collection('craft');

        //=== craft Related Apis
        app.delete('/craft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.deleteOne(query);
            res.send(result);
        })
        app.get('/craft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.findOne(query);
            res.send(result);
        })
        app.put('/craft/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedCraft = req.body;

            const craft = {
                $set: {
                    // name: updatedCoffee.name,
                    // category: updatedCoffee.quantity,
                    // supplier: updatedCoffee.supplier,
                    // taste: updatedCoffee.taste,
                    // category: updatedCoffee.category,
                    // details: updatedCoffee.details,
                    // photo: updatedCoffee.photo
                    name:updatedCraft.name,
                    category:updatedCraft.category,
                    subCategory:updatedCraft.subCategory,
                    price:updatedCraft.price,
                    rating:updatedCraft.rating,     
                    description:updatedCraft.description,
                    customization:updatedCraft.customization,
                    time:updatedCraft.time,
                    username:updatedCraft.username,
                    email:updatedCraft.email,
                    stock:updatedCraft.stock,
                    photo:updatedCraft.photo
                }
            }

            const result = await craftCollection.updateOne(filter, craft, options);
            res.send(result);
        })

        app.get('/crafts',async (req, res) => {
            const cursor = craftCollection.find();
            const result=await cursor.toArray();
            res.send(result);
          }) 

        app.post('/crafts',async(req,res)=>{
            const newCraft=req.body;
            //console.log(newCraft);
            const result = await craftCollection.insertOne(newCraft);
            res.send(result);
        })

       //======User Related Apis
       //get user
       app.get('/users',async(req,res)=>{
        const cursor=userCollection.find();
        const users=await cursor.toArray();
        res.send(users)
       })
       //Pathch a user
       app.patch('/users',async(req,res)=>{
       const user=req.body;
       console.log(user);
       const filter={email:user.email};
       const updateDoc={
        $set : {
            lastLogIn:user.lastLogIn,
        }
       }
       const result=await userCollection.updateOne(filter,updateDoc);
       res.send(result);

       })
       //Creat User
       app.post('/users',async(req,res)=>{
        const newUser=req.body;
        //console.log(newUser);
        const result=await userCollection.insertOne(newUser);
        res.send(result);
       })
       

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Craft store  server is running')
})

app.listen(port, () => {
    console.log(`Coffee Server is running on port: ${port}`)
})