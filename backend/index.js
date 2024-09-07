const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const app=express();
const cookieParser=require("cookie-parser");
const routes=require("../backend/routes/routes");



app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']
}));
app.use(express.json());
app.use("/",routes);

app.get("/",(req,res)=>{
    res.send("welcome");
})




main()
.then(()=>{
    console.log("DB connected");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Angular');
}

app.listen(8080,()=>{
    console.log("server started");
})