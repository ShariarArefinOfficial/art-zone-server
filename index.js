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