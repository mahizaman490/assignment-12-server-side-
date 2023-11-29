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
    const allDeliveryManCollection = client.db('BDparcel').collection('allDeliveryMan')
    app.get('/bookings', async (req, res) => {

      const cursor = bookingCollection.find()
      const result = await cursor.toArray()
      res.send(result)

    })


    app.get('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bookingCollection.findOne(query)
      res.send(result)
    })





    app.post('/bookings', async (req, res) => {

      const newBook = req.body;
      console.log(newBook);
      const result = await bookingCollection.insertOne(newBook);
      res.send(result)


    })


    app.put('/bookings/:id', async (req, res) => {

      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedbooking = req.body;
      const booking = {
        $set: {


          Phone_Number: updatedbooking.Phone_Number,
          email: updatedbooking.email,
          name: updatedbooking.name,
          Receivers_Name: updatedbooking.Receivers_Name,
          price: updatedbooking.price,
          Parcel_Weight: updatedbooking.Parcel_Weight,
          Parcel_Type: updatedbooking.Parcel_Type,
          Receiver_Phone_Number: updatedbooking.Receiver_Phone_Number,
          Requested_Delivery_Date: updatedbooking.Requested_Delivery_Date,
          Delivery_Address_Latitude: updatedbooking.Delivery_Address_Latitude,
          Parcel_Delivery_Address: updatedbooking.Parcel_Delivery_Address,
          Delivery_Address_longitude: updatedbooking.Delivery_Address_longitude

        }

      }


      const result = await bookingCollection.updateOne(filter, booking, options)

      res.send(result)



    })












    app.delete('/bookings/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bookingCollection.deleteOne(query)
      res.send(result)


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


    ///deliveryMan guloke  dekhabo



    app.get('/allDeliveryMan', async (req, res) => {
      const cursor = allDeliveryManCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/users', async (req, res) => {
      const cursor = userCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })



    app.put('/users', async (req, res) => {

      const id = req.query.id;
      const { newRole } = req.body;
      const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { role: newRole } }
      );
      res.send(result)
    })













    app.get('/singleUser', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const result = await userCollection.findOne(query)
      res.send(result);
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



