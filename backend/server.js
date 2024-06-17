//create express modules
const exp = require("express");
const app = exp()
const path = require("path")
require('dotenv').config()

// deploy react build in this server
app.use(exp.static(path.join(__dirname, "../frontend/build")))

//import mongoclient
const mongoClient = require("mongodb").MongoClient;

//body parser middleware
app.use(exp.json());

//connect to database
mongoClient.connect(process.env.DB_URL)
  .then(client => {
    //get db obj
    const fooditemdb = client.db('fooditemdb');
    //get collection obj
    const usersCollection = fooditemdb.collection("userCollection")
    const foodCollection=fooditemdb.collection("foodCollection");
    const replicatecollection=fooditemdb.collection("userreplicatecollection");
      //share collection obj with exp app
      app.set("usersCollection",usersCollection);
      app.set("foodCollection",foodCollection);
      app.set("replicatecollection",replicatecollection);
      //confirm connection status
      console.log("DB is connected");
  })
  .catch(err => {
    console.log("Error in connection", err);
  })


//import api routes
const userApp = require("./APIs/user-api")

//if patr starts with user-api,send request to userApi
app.use("", userApp);






app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"))
})

//exp err handler
app.use((err, req, res, next) => {
  res.send({message:err.message});
})
const port=process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port 5000...`))