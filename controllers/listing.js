const listings = require("../models/listings")
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxgeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    
    const { cateogry, search } = req.query
    
    if (search) {
        let allListing = await listings.find({ $or: [{ location: new RegExp(search, "i") }, { title: new RegExp(search, "i") }] })
        return res.render("listings/index.ejs",{allListing})
    }
    
    if (cateogry) {
        const allListing= await listings.find({ cateogry: cateogry })
        res.render("listings/index.ejs",{allListing})
    } else {
        const allListing = await listings.find({})
        res.render("listings/index.ejs", { allListing })
    }
    
}
    


module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs")
}


module.exports.showListing=async(req,res)=>{
    let { id } = req.params;
    
    let listing = await listings.findById(id).populate({ path:"reviews",populate:{path:"author"}}).populate("owner")
    if (!listing) {
        req.flash("error", "Listing you are requested for does not exists")
        res.redirect("/listings")
    }
   
    res.render("listings/show.ejs", { listing })
}
    


module.exports.createListing = async (req, res, next) => {
     console.log(req.body.listing)

    let coordinates= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()

    let url = req.file.path
    let filename=req.file.filename
     
    let listing = new listings(req.body.listing)
    listing.owner = req.user._id
    listing.image = { url, filename }
    listing.geometry = coordinates.body.features[0].geometry
    console.log(listing)
    console.log(listing.geometry)
    await listing.save()
    req.flash("success","new listing created")
    res.redirect("/listings")
}
    

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params
    let listing = await listings.findById(id)

    

    let orginalImageUrl = listing.image.url
    orginalImageUrl = orginalImageUrl.replace(
        "/upload",
        "/upload/e_blur:100,c_thumb,g_face,h_200,w_250/f_auto"
    );
    
    
    if (!listing) {
        req.flash("error", "Listing you are requested for does not exists")
        return res.redirect("/listings")
    }

    res.render("listings/edit.ejs", { listing, orginalImageUrl })
}
    

module.exports.updateListing=async (req, res) => {

    let { id } = req.params;
    let listing = await listings.findByIdAndUpdate(id, {
        ...req.body.listing
        // image: { url: req.body.listing.image }
    });

    if (typeof req.file != "undefined" ) {
        let url = req.file.path
        let filename = req.file.filename

        listing.image = { url, filename }

        await listing.save()
    }

    req.flash("success", "listing updated")
    res.redirect(`/listings/${id}`)
}
    


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params
    let listing = await listings.findByIdAndDelete(id)
    req.flash("success", "listing Deleted")
    res.redirect("/listings")
}