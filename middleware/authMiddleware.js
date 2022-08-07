const jwt = require("jsonwebtoken");
const User = require("../models/User")

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    //Check if json web token exits and is verified
    if (token) {
        jwt.verify(token, "nazimhere", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/login")
            } else {
                console.log(decodedToken);
                next();
            }
        })

    } else {
        res.redirect("/login");
    }
}

//Check Current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, "nazimhere", async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.locals.userWhichWeSee = null;
                next();
            } else {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.userWhichWeSee = user; //passing user to views
                next();
            }
        })

    } else {
        res.locals.userWhichWeSee = null;
        next();
    };
}

module.exports = { requireAuth, checkUser };