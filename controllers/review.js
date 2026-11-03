const Review = require("../models/review.js")
const listings = require("../models/listings")


module.exports.createReview = async (req, res) => {

    let listing = await listings.findById(req.params.id)
    let newReviews = new Review(req.body.review)
    newReviews.author = req.user._id


    listing.reviews.push(newReviews)

    await newReviews.save()
    await listing.save()
    req.flash("success", "new review created")

    console.log("new review saved")

    res.redirect(`/listings/${listing._id}`)
}




module.exports.destroyReview = async (req, res) => {

    let { id, reviewid } = req.params
    await listings.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
    await Review.findByIdAndDelete(reviewid)
    req.flash("success", "review deleted")

    res.redirect(`/listings/${id}`)
}