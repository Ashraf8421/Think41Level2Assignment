const express = require("express");
const app = express();
const port = 8080;


const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
}


app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})