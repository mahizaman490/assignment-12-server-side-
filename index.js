const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

//middlewere
app.use(cors());
app.use(express.json())
console.log(process.env.DB_PASS);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mahizaman490.idhpwvk.mongodb.net/?retryWrites=true&w=majority`;

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



    const topDeliveryCollection = client.db('BDparcel').collection('topDelivered')
    const userCollection = client.db('BDparcel').collection('users')


//users releted API

app.post('/users', async (req,res) =>{
    const user = req.body;
 const query = {email:user.email}
 const existingUser = await userCollection.findOne(query);
 if(existingUser){
    return res.send({message:'user already exists', insertedId: null})
 }
    const result = await userCollection.insertOne(user);
    res.send(result)
})














app.get('/topDelivered', async(req,res)=>{
    const cursor = topDeliveryCollection.find()
    const result = await cursor.toArray()
    res.send(result)

})





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error

  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send( 'BD-parcel-management-server is running')
})





app.listen(port,()=>{
    console.log(` BD-parcel-management-server is running on port ${port}`);

})