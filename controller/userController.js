const UserProfile=require("../models/userProfile")
const { required } = require('nodemon/lib/config');
const userSchema = require('../models/userSchema');
const UserSchema = require("../models/userSchema");
const fs = require('fs'); 


    exports.createProfile = async (req, res) => {
        try {
            const { userName, userBio} = req.body;
            const userId = req.user.id;
            const file=req.files.userImage;
            
            const userImage=__dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
            console.log(userImage);

            file.mv(userImage,(err)=>{
                console.log(err);
            });

            // Find if user profile already exists
            let profileExist = await UserProfile.findOne({ userId });
        
            if (profileExist) {
                // Set req.profileId to existing profile's _id
                req.user.profileId = profileExist._id.toString();
                console.log(req.user)
        
                return res.json({
                    message: "User Profile Is Already Exist, you can Update it"
                });
            }
        
            // Validate request body
            if (!userName || !userBio || !file) {
                return res.status(400).json({
                    message: "All fields are required"
                });
            }
        
            // Validate userId
            if (!userId) {
                return res.status(400).json({
                    message: "User ID is required"
                });
            }
        
            // Create the User Profile
            const profileData = await UserProfile.create({ userName, userBio, userImage, userId });
        
            // Set req.profileId to the new profile's _id
            req.profileId = profileData._id.toString();
        
            res.status(200).json({
                data: profileData._id,
                message: "User profile created and linked successfully"
            });
        
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
        
    };



//UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { userName, userBio, profileId } = req.body;
        const userId = req.user.id;
        const file = req.files.userImage;

        // Validate request body
        if (!userName || !userBio || !file) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const path=__dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
        console.log(path)

        // Move the file to the specified location
        file.mv(path, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error uploading file" });
            }

            try {
                // Update user profile with the file path
                const userProfile = await UserProfile.findByIdAndUpdate(profileId, {
                    userName,
                    userBio,
                    userImage: path
                }, { new: true }).exec();

                if (!userProfile) {
                    return res.status(400).json({
                        message: "Data is Not Updated"
                    });
                }



                res.status(200).json({
                    data: userProfile,
                    message: "User profile updated successfully"
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


//GETTING PROFILE
exports.getProfile =async(req,res)=>{
    try {
        const userId=req.user.id;
        const profileId=req.params.id;
        console.log(profileId)

        // Find user profile by ID
        const userProfile = await UserProfile.findById(profileId);
        console.log("Printing User Profile",userProfile)

        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        res.status(200).json({ data: userProfile, message: "User profile retrieved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


exports.deleteProfile=async(req,res)=>{
    try {
        const userId=req.user.id;
        const profileId=req.params.id;
        // Delete user profile by ID
        const deletedProfile = await UserProfile.findByIdAndDelete(profileId);

        if (!deletedProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        res.status(200).json({ data: deletedProfile, message: "User profile deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}