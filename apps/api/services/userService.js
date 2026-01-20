import User from "../models/userModel.js";

async function getAllUsersService(){
    return await User.find();
}

async function getUserByIdService(userId) {
    return await User.findById(userId);
};

async function updateUserService(userId, userData){
    const updatedUser = await User.findByIdAndUpdate(
        userId, 
        userData,
        { new: true }
    );
    updatedUser.updatedAt = new Date();
    await updatedUser.save();
    return updatedUser;
};

async function deleteUserService(userId){
    return await User.findByIdAndDelete(userId);
}

async function loginService(email, password) {
    
}
async function registerService(userData){
    const newUser = new User({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        birthDate: userData.birthDate,
    });
    return await newUser.save();
}

export { getAllUsersService, getUserByIdService, updateUserService, deleteUserService, loginService, registerService }