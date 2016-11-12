// Checks if user is authenticated
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg', 'É necessário estar autenticado');
        res.redirect('/login');
    }
}

// TODO vvv
function isModerator() {
    return true;
}

module.exports = {
    "ensureAuthenticated": ensureAuthenticated,
    "isModerator": isModerator
};