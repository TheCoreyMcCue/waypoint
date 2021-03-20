module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in to add an airport');
        return res.redirect('/login');
    }
    next()
}