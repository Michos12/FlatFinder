import { getAllUsersService, getUserByIdService, updateUserService, deleteUserService, loginService, registerService } from "../services/userService.js";

async function getAllUsersController(req, res) {
    try{
        const users = await getAllUsersService();
        console.log(req);
        res.status(200).json(users);
    } catch (error){
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
}

async function getUserByIdController(req, res){
    try{
        const user = await getUserByIdService(req.params.id);
        res.status(200).json(user);
    } catch (error){
        if (error.message === "User not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
}

async function updateUserController(req, res){
    try{
        const updatedUser = await updateUserService(req.params.id, req.body);
        res.status(200).json(updatedUser);
    } catch (error){
        if (error.message === "User not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(400).json({ error: error.message });
    }
}

async function deleteUserController(req, res){
    try{
        await deleteUserService(req.params.id);
        res.status(200).json({ 
            message: "User deleted successfully",
            deletedUser: req.params.id
         });
    } catch (error){
        if (error.message === "User not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: `Server error: ${error.message}`})
    }
}

async function loginController(req, res){
    try{
        const { email, password } = req.body;
        const { user, token } = await loginService(email, password);
        res.header('x-auth-token', token).status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error){
        if (error.message === "Invalid email or password") {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
}

async function registerController(req, res){
    try{
        const { user, token } = await registerService(req.body);
        res.header('x-auth-token', token).status(201).json({ 
            message: "User registered successfully",
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName
            },
            token 
        });
    } catch (error){
        if (error.message === "User already exists") {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });        
    }
}

export { getAllUsersController, getUserByIdController, updateUserController, deleteUserController, loginController, registerController }