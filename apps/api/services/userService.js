import User from "../models/userModel.js";

async function getAllUsersService(){
    return await User.find().select("-password");
}

async function getUserByIdService(userId) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

async function updateUserService(userId, userData){
    // THIS DOESNT HASH THE PASSWORD
    const updatedUser = await User.findByIdAndUpdate(
        userId, 
        userData,
        { new: true }
    );
    return await updatedUser.save();
};

async function deleteUserService(userId){
    const deletedUser = await User.findByIdAndDelete(userId);
    if(!deletedUser){
        throw new Error("User not found");
    }
    return deletedUser;
}

async function loginService(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new Error("Invalid password");
    }
    const token = user.generateAuthToken();
    return { user, token };
}
    
async function registerService(userData){
    const existUser =  await User.findOne({ email: userData.email });
    if(existUser) throw new Error("User already exists with this email");
    else{
        const newUser = new User({
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            birthDate: userData.birthDate,
        });
        await newUser.save();
        const token = newUser.generateAuthToken();
        return { user: newUser, token };
    }
}

export { getAllUsersService, getUserByIdService, updateUserService, deleteUserService, loginService, registerService }