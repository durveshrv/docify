const dotenv=require("dotenv")
const express = require("express");
const mongoose = require("mongoose")
const Document = require("./Document")
const path=require('path')
bcrypt=require('bcrypt');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const UserModel = require("./models/Users");
const authenticate=require("./middleware/authenticate");
let mongoDBURL = process.env.mongoDBURL;
mongoose.connect(mongoDBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("could not connect to mongoDB"));
dotenv.config()
const app = express();
app.use(express.json());
app.use(cors());
const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

const defaultValue = ""

io.on("connection", socket => {
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId)
    socket.join(documentId)
    socket.emit("load-document", document.data)

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta)
    })

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { data })
    })
  })
})

async function findOrCreateDocument(id) {
  if (id == null) return

  const document = await Document.findById(id)
  if (document) return document
  return await Document.create({ _id: id, data: defaultValue })
}
app.post("/login", async (req, res) => {
  let success=false;
  try{
  const {email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({error:"Plz Filled the data"})
  }
  const userLogin = await UserModel.findOne({ email: email });
  if(userLogin){
    const isMatch=await bcrypt.compare(password,userLogin.password);
    const token = await userLogin.generateAuthToken();
    success=true;
    if (!isMatch){
      success=false;
      res.status(400).json({ error: "Invalid Credentials" });
    }
    else{
      // res.status(200).json({});

    res.status(200).json({ success:true, token ,message: "user Signin Successfully" });
    }
  }else{
    success=false;
    res.status(400).json({ error: "Invalid Credentials" });
  }
}catch (err) {
  console. log(err);
  res.send("error") ;
}
});

//register
app.post("/register", async (req, res) => {
  const {name,email,phoneno,password,gndr} =req.body;
  if(!name || !email || !phoneno || !password || !gndr){
    return res.status(422).json({error:"plz fill the fields properly"})
  }
    try {
        const userExist= await UserModel.findOne({email:email});
        if(userExist){
          return res.status(422).json({error:"Email already Exist"});
        }
        const user=new UserModel({name,email,phoneno,password,gndr});
        
        await user.save();
        res.status(201).json({message:"User Registered Successfully"});
    } catch (err) {
        console.log(err);
    }
});
app.get("/users/:id", async (req, res) => {
  const user = await UserModel.findById(req.params.id).select("-password");
  if (!user) return res.send("this user does'nt exists in the database!");
  res.send(user);
});
app.get('/about', authenticate,async (req, res) => {
  try{
    userId=req.user;
    const user=await UserModel.findById(userId).select("-password")
    res.send(user);
  }catch (error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});