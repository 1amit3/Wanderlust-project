const listings = require("./models/listings.js")
const reviews=require("./models/review.js")
const expressError = require("./utils/expressError.js")
const { listingSchema,reviewSchema } = require("./schema.js");


module.exports.isloggedin = (req, res, next) => {
   
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl
        req.flash('error', "you must login first")
        return res.redirect("/login")

    }
    next()
}



module.exports.saveRedirectUrl = (req, res, next)=>{
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}




module.exports.isOwner = async (req, res, next) => {
    let{id}=req.params
    let listing = await listings.findById(id)
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you dont have permission")
        return res.redirect(`/listings/${id}`)
    }
    next()
}


module.exports.validateListing=(req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    
    
    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",")
        throw new expressError(400, errmsg)
    }
    else {
        next();
    }
    
}


module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",")
        throw new expressError(400, errmsg)
    }
    else {
        next();
    }

}

module.exports.isReviewOwner = async (req, res, next) => {
    let { reviewid, id } = req.params
    let review = await reviews.findById(reviewid)
    console.log(review.author)
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "you dont have permission")
        return res.redirect(`/listings/${id}`)
    }
    
    next()
}
