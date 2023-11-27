const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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


    const bookingCollection = client.db('BDparcel').collection('bookings')
    const topDeliveryCollection = client.db('BDparcel').collection('topDelivered')
    const userCollection = client.db('BDparcel').collection('users')

app.get('/bookings', async(req,res) =>{

const cursor = bookingCollection.find()
const result = await cursor.toArray()
res.send(result)

})








    app.post('/bookings', async (req, res) => {

      const newBook = req.body;
      console.log(newBook);
      const result = await bookingCollection.insertOne(newBook);
      res.send(result)


    })



app.delete('/bookings/:id', async(req,res)=>{

  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await bookingCollection.deleteOne(query)



})



    //users releted API

    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'user already exists', insertedId: null })
      }
      const result = await userCollection.insertOne(user);
      res.send(result)
    })














    app.get('/topDelivered', async (req, res) => {
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


app.get('/', (req, res) => {
  res.send('BD-parcel-management-server is running')
})





app.listen(port, () => {
  console.log(` BD-parcel-management-server is running on port ${port}`);

})