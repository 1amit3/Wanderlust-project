const mongoose=require("mongoose")
const listings=require("../models/listings.js")
const initData=require("./data.js")

MONGO_URl="mongodb://127.0.0.1:27017/wanderlust3"

main()
.then((res)=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URl)
}

const initDB= async ()=>{

    await listings.deleteMany({})
    // agar koi pahle se dataho to usko hatane ke lie

   initData.data= initData.data.map((obj)=>({...obj,owner:'6adf3a0fcf26b9de383f75f9'}))
    
   await  listings.insertMany(initData.data)
   console.log("initialized Data")
}

initDB();