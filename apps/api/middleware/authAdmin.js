function admin(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({ error: "Access denied. No token provided."})
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        if(req.user.role == 'admin'){
            next()
        } else if(req.user.role == "owner"){
            if (req.user.role == "owner") next()
            else return res.status(403).json({ error: "Access denied. You can only modify your own account." }); 
        } else {
            return res.status(403).json({ error: "Access denied. Admins and accounts owner only can access this." });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export default admin;