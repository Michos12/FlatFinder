function admin(req, res, next, permissionNeeded) {
    const token = req.header('x-auth-token');
    if(!token) return false
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        if(req.user.role == 'admin'){
            return true
        } else if(permissionNeeded == "owner"){
            if (req.user.role == "owner") return true
            else return return false; 
        } else {
            return return false;
        }
    } catch (err) {
        console.error('error: ' + err });
        return false
    }
};

export default admin;