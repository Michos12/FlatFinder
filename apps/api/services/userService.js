import User from "../models/userModel.js";

async function getAllUsers(){
    return await User.find();
}

async function getUserById(userId) {
    return await User.findById(userId);
};

async function updateUser(userId, userData){
    return await User.findByIdAndUpdate(
        userId, 
        userData,
        { new: true }
    );
};

async function deleteUser(userId){
    return await User.findByIdAndDelete(userId);
}

async function login(){

}
async function register(userData){
    const newUser = new User({
        email: userData.email,
        password: userData.password,
        firstName: userData.name,
        lastName: userData.surname,
        birthDate: userData.birthDate,
    });
    return await newUser.save();
}

export { getAllUsers, getUserById, updateUser, deleteUser, login, register}