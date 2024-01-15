
const User = require("../models/User")


exports.checkUserByEmailOrPhone = async(email, phone)=>{
    return await User.findOne({ $or: [{ email: email }, { phone: phone }] });
}

exports.createUser = async(data)=>{
    const user = new User({...data});
    return user.save();
}

//find user by any field
exports.findOneByField = async(field)=>{
    console.log(field);
    return await User.findOne(field)
}

