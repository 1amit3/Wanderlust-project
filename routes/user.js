const express = require("express")
const user = require("../models/user")
const wrapAsync = require("../utils/wrapAsync")
const router = express.Router()
const passport = require("passport")
const { saveRedirectUrl } = require("../middleware.js")
const userController=require("../controllers/user.js")


router.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsync(userController.signUp))

router.route("/login")
.get( wrapAsync(userController.renderLoginForm))
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(userController.login))


router.route("/logout")
.get(userController.logout)


module.exports=router