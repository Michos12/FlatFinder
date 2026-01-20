import { getAllUsersService, getUserByIdService, updateUserService, deleteUserService, loginService, registerService } from "../services/userService.js";
import existsValidator from "../validators/existsValidator.js";

function getAllUsersController(req, res) {
    try{
        getAllUsersService().then(users => {
            res.status(200).json(users);
        });
    } catch (error){
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
}

function getUserByIdController(req, res){
    try{
        getUserByIdService(req.params.id).then(user => {
            existsValidator(user);
        });
    } catch (error){
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
}

function updateUserController(req, res){
    try{
        updateUserService(req.params.id, req.body).then(updatedUser => {
            existsValidator(updatedUser);
        });
    } catch (error){
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
}

function deleteUserController(req, res){
    try{
        deleteUserService(req.params.id).then(objective => {
            existsValidator(objective);
        });
    } catch (error){
        res.status(500).json({ error: `Server error: ${error.message}`})
    }
}
function loginController(req, res){
    try{

    } catch (error){
        
    }
}

function registerController(req, res){
    try{
        
    } catch (error){
        
    }
}

export { getAllUsersController, getUserByIdController, updateUserController, deleteUserController, loginController, registerController }