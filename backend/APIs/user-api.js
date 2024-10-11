//create user-api app
const exp = require("express")
const userApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/verifyToken")
const multer = require("multer");
const { cloudinary, storage } = require("../utils/cloudinary");
const upload = multer({ storage });
require('dotenv').config();

//get userscollection 
let usercollection;
userApp.use((req, res, next) => {
  usercollection = req.app.get("usersCollection");
 //console.log(usercollection);
  next();
})

//get recipescollection
let foodcollection;
userApp.use((req, res, next) => {
  foodcollection = req.app.get("foodCollection");
  //console.log(foodcollection);
  next();
})

//get replicatecollections
let replicatecollection;
userApp.use((req, res, next) => {
  replicatecollection = req.app.get("replicatecollection");
next();
})


//user registration route
userApp.post('/user', expressAsyncHandler(async (req, res) => {
  //get user resource from client
  const newUser = req.body;
  //check for duplicate username
  const dbUser = await usercollection.findOne({ username: newUser.username });
  //duplicate found
  if (dbUser !== null) {
    res.send({ message: "username already exist" });
  } else {
    //hash password
    let hashedPassword = await bcryptjs.hash(newUser.password, 5);
    //replace plain password with hashed password
    newUser.password = hashedPassword;
    //save in the db
    await usercollection.insertOne(newUser);
    const obj={}
    obj.username=newUser.username;
    obj.orders=[];
    obj.cart=[];
    obj.userImage=null;
    //console.log(obj);
    await replicatecollection.insertOne(obj);
    //console.log()
    res.send({ message: "User Created" });
  }
}))

//user login route
userApp.post("/login", expressAsyncHandler(async (req, res) => {
  //get user credential details from body
  let userCredential = req.body;
  //find username
  let dbUser = await usercollection.findOne({ username: userCredential.username });
  //user not exist
  if (dbUser === null) {
    res.send({ message: "Invalid Username" });
  }
  //check password
  const status = await bcryptjs.compare(userCredential.password, dbUser.password);
  //password wrong
  if (status === false) { 
    res.send({ message: "Invalid Password" });
  }
  //create jwt token
  let signedToken = jwt.sign({ username: dbUser.username },process.env.SECRET_KEY, { expiresIn: "1d" });
  //send jwt
  res.send({ message: "Login Success", token: signedToken, user: dbUser });
}))

// get all food products
userApp.get('/fooditem', expressAsyncHandler(async (req, res) => {
  const foodList = await foodcollection.find().toArray()
  //console.log(foodList);
  // send res
  res.send({ message: "FoodList", payload: foodList })
}))

//get specific food items
userApp.get('/fooditem/:title',expressAsyncHandler(async(req,res)=>{
  const foodItem = await foodcollection.findOne({title:req.params.title})
  res.send({message:"FoodItem",payload:foodItem})
}))

//all previous purchases
userApp.put('/paymentSuccess/:username', expressAsyncHandler(async (req, res) => {
  //const orderObj = req.body;
  const user = req.params.username;
  const orderObj= await replicatecollection.find({username:user}).toArray()
  const prodObj=orderObj[0].cart;
  const iobj={}
  iobj.date = new Date().toLocaleString();
  iobj.order = prodObj;
  //console.log(iobj);
  //Update the order to the user
  // for(const obj of prodObj){
    await replicatecollection.updateOne({ username: user }, { $push: { orders: iobj } });
  //}
    await replicatecollection.updateOne({username:user},{$set:{cart:[]}})
  res.send({ message: 'Payment Successful!' });
}));

//get cart products
userApp.get('/cart/:username', expressAsyncHandler(async (req, res) => {
  const user = req.params.username;
  const cart = await replicatecollection.findOne({ username: user });
  //console.log(cart);
  res.send({ message: "Cart", payload: cart.cart });
  }));

// add products to cart
userApp.put('/cart/:username', expressAsyncHandler(async (req, res) => {
  const orderObj = req.body;
  const username = req.params.username;

  const user = await replicatecollection.findOne({ username });
  if (!user) {
    return res.send({ message: 'User not found' });
  }

  const cartItem = user.cart.find(item => item.title === orderObj.title);

  if (cartItem) {
    // Update the existing item in the cart
    await replicatecollection.updateOne(
      { username, 'cart.title': orderObj.title },
      { $set: { 'cart.$': orderObj } }
    );
  } else {
    // Add a new item to the cart
    await replicatecollection.updateOne(
      { username },
      { $push: { cart: orderObj } }
    );
  }

  res.send({ message: 'Updated cart successfully' });
}));
//delete a product from cart
userApp.put('/deleteproduct/:username',expressAsyncHandler(async(req,res)=>{
  const cartObj=req.body;
  //console.log(cartObj);
  const user=req.params.username;
  await replicatecollection.updateMany({username:user},{$pull:{cart:{title:cartObj.title}}});
  res.send({message:'Deleted a product from cart'});
}))



//increase or decrease the quantity
userApp.put('/quantity/:username', expressAsyncHandler(async (req, res) => {
  const obj = req.body;
  //console.log(obj);
  const user = req.params.username;
        await replicatecollection.updateOne({ username: user, 'cart.title': obj.title }, {$set:{'cart.$.quantity':obj.quantity}});
        res.send({message:'Quantity updated'});
}));

userApp.get('/reviews/:title', expressAsyncHandler(async (req, res) => {
  const title = req.params.title;
  const food = await foodcollection.findOne({title:title});
  if (!food) {
    return res.status(404).send({ message: 'Item not found' });
  }
  const reviews = food.reviews; // Assuming you have a 'reviews' array field in the food document
  res.send({ message: 'User reviews',payload:reviews });
}));

userApp.put('/reviews/:title', expressAsyncHandler(async (req, res) => {
  const title = req.params.title;
  const review = req.body;
  // Assuming you have a 'reviews' array field in the user document
  await foodcollection.updateOne({ title:title }, { $push: { reviews: review } });
  res.send({ message: 'Review added successfully' });
}));

//get replicate data
userApp.get('/replicateuser/:username',expressAsyncHandler(async(req,res)=>{
  const username = req.params.username;
  const user = await replicatecollection.findOne({username:username});
  if(!user){
    return res.status(404).send({message:'User not found'});
    }
    res.send({message:'Replicate user data',payload:user});
}))



userApp.put("/updateimage/:username",upload.single("userImage"), // handle single image upload
  expressAsyncHandler(async (req, res) => {
    const { username } = req.params;
    const imageUrl = req.file.path; // Cloudinary URL of uploaded image
    // Update the user's profile image in the database
    let updatedUser = await replicatecollection.findOneAndUpdate({ username },{ $set: { userImage: imageUrl } },{ returnOriginal: false });
    res.status(200).send({ message: "Image updated successfully", payload: updatedUser });
  })
);

//export user App
module.exports = userApp;