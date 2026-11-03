if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose")
const express=require("express")
const listings = require("./models/listings")
const Review = require("./models/review.js");
const app=express()
const port=3000;
const path=require("path")
const ejsMate=require("ejs-mate")
const methodOverride = require("method-override")
const wrapAsync = require("./utils/wrapAsync.js")
const expressError=require("./utils/expressError.js")
const {listingSchema,reviewSchema}=require("./schema.js");
const review = require("./models/review.js");
const listingrouter = require("./routes/listing.js")
const reviewsrouter = require("./routes/review.js")
const userrouter = require("./routes/user.js")
const session = require("express-session")
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const user=require("./models/user.js")

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))

app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))


// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust3"

const dbURL=process.env.ATLASDB_URL

main()
.then((res)=>{
    console.log("connected to db")
})
.catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(dbURL)
}

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret:process.env.SECRET
    },
    touchAfter: 24 * 3600
})

store.on("error", (err) => {
    console.log("error in MONGO SESSION STORE",err)
})

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
}



app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(user.authenticate()))

passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())



app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser=req.user
    next()
})

app.get("/demouser", async (req, res) => {
    let fakeuser = new user({
        email :"qwert@gmail.com",
        username:"qwerty"
    
    })
        
    let registereduser = await user.register(fakeuser, "hello world")
    res.send(registereduser)
})

app.use("/listings/:id/reviews", reviewsrouter)
app.use("/listings", listingrouter)
app.use("/",userrouter)



app.all("/*splat", (req, res, next) => {
    next(new expressError(404,"page not found !"))
})


app.use((err, req, res, next) => {
    let { status = 500, message } = err
    res.status(status).render("./listings/error.ejs",{message,status})
    // res.status(status).send(message)
    // res.send("error occured")
})


app.listen(port,()=>{
    console.log("listening to port 3000")
})