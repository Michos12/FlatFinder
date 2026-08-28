import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

function admin(req, permissionNeeded = "admin") {
    const token = req.header('x-auth-token');
    if(!token) return false
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
            if(req.user.role == "admin") return true
            return (function (permissionNeeded, req){
                switch(permissionNeeded){
                    case "owner":
                        if(req.user.role == "owner" || req.user.role == "admin"){
                            return true
                        } else {
                            return false
                        }
                    case "admin":
                        if(req.user.role == "admin"){
                            return true
                        } else {
                            return false
                        }
                }
            })(permissionNeeded, req)
    } catch (err) {
        console.error({error: err.message});
        return false
    }
};

export default admin;