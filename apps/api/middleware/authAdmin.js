function admin(req, res, next) {
    if(req.user._id == req.params.id || req.user.isAdmin){
        next();
    } else {
        return res.status(403).json({ error: "Access denied. Admins or account owner only." });
    }
}

export default admin;