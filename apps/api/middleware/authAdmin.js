function admin(permissionNeeded = "admin", req = req, res = res) {
    const token = req.header('x-auth-token');
    if(!token) return false
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
            if(req.user.role == "admin") return true
            switch(permissionNeeded){
                case "owner":
                    if(req.user.role == "owner" || req.user.role == "admin"){
                        return true
                        break
                    } else {
                        return false
                        break
                    }
                case "admin":
                    if(req.user.role == "admin"){
                        return true
                        break
                    } else {
                        return false
                        break
                    }
            }
    } catch (err) {
        console.error({error: err.message});
        return false
    }
};

export default admin;