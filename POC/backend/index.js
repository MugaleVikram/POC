const express=require("express");
const mongoose=require("mongoose");
const app=express();
const cookieParser=require("cookie-parser");


main()
.then(()=>{
    console.log("DB connected");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Angular2');
}

app.listen(8080,()=>{
    console.log("Server started");
})