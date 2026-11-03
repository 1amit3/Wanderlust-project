const express = require("express")
const router = express.Router({mergeParams:true})
const { reviewSchema } = require("../schema.js");
const expressError = require("../utils/expressError.js")
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/review.js");
const listings = require("../models/listings")
const { validateReview, isOwner, isloggedin, isReviewOwner } = require("../middleware.js")
const reviewController=require("../controllers/review.js")




//reviews Post route

router.post("/", validateReview,isloggedin, wrapAsync(reviewController.createReview))



//Delete route reviews

router.delete("/:reviewid", isloggedin, isReviewOwner, wrapAsync(reviewController.destroyReview))


module.exports=router