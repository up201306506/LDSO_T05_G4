function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// TO DO vvv
function isModerator() {
    return true;
}

module.exports = {
    "ensureAuthenticated": ensureAuthenticated,
    "isModerator": isModerator
};