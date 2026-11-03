const express = require("express")
const router = express.Router()
const { listingSchema, reviewSchema } = require("../schema.js");
const listings = require("../models/listings")
const expressError = require("../utils/expressError.js")
const wrapAsync = require("../utils/wrapAsync.js")
const methodOverride = require("method-override")
const { isloggedin, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer = require('multer')
const{storage}=require("../cloudconfig.js")
const upload = multer({ storage })


//new route
router.route("/new")
    .get(isloggedin, listingController.renderNewForm)



//index/create route

router.route("/")
.get( wrapAsync(listingController.index))
    .post(upload.single("listing[image]",validateListing), wrapAsync(listingController.createListing))
 


//update/update/delete route

router.route("/:id")
.get(wrapAsync(listingController.showListing)) 
    .put(isloggedin, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
.delete( isloggedin, isOwner, wrapAsync(listingController.destroyListing))
    

//edit route
router.route("/:id/edit")
.get( isloggedin, isOwner, wrapAsync(listingController.renderEditForm))




module.exports=router