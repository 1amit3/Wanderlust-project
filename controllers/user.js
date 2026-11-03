const user = require("../models/user")

module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup.ejs")
}

module.exports.signUp=async (req, res) => {
    try {
        let { username, email, password } = req.body
        const newUser = new user({ email, username })
        const registeredUser = await user.register(newUser, password)
        console.log(registeredUser)
        req.login(registeredUser, (err) => {
            if (err) {
               return next(err)
            }
                req.flash("success", "welcome to wanderlust")
                res.redirect("/listings")
        })
       
    }
    catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}
    

module.exports.renderLoginForm=async (req, res) => {
    res.render("user/login.ejs")

}


module.exports.login = async (req, res) => {
    req.flash("success", "welcome back to wanderlust")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)

}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err)
        }
        else {
            req.flash("success", "logout successfull")
        }
        res.redirect("/listings")
    })
}