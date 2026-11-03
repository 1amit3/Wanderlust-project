const mongoose = require("mongoose")
const Schema = mongoose.Schema 
const reviews=require("./review.js")

const listingsSchema=new mongoose.Schema({
    title:String,

    description:String,

    image:{

        url: String,
        filename: String 
        
    },

    location:String,

    price:Number,

    country: String,
    
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:"review"
            
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref:"user"
   },
  
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    cateogry: {
        type: String,
        enum:["arctic","mountains","amazing swims","castles","rooms","trending","iconic cities","farm"]
    }


})

listingsSchema.post('findOneAndDelete', async (listing) => {
    if (listing) {
        await reviews.deleteMany({ _id: { $in: listing.reviews } })
    }
})


const listings=new mongoose.model("listings",listingsSchema)

module.exports=listings