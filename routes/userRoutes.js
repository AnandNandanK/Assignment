const express=require('express');
const router=express.Router();
const {createPost,getAllUserPosts,latestPosts,updatePost,deletePost}=require("../controller/PostController");
const login =require("../controller/login");
const signUp =require("../controller/signUp");
const {auth}=require("../middelware/auth");
const {createProfile,updateProfile,getProfile,deleteProfile}=require("../controller/userController");
const {followUser,unfollowUser,userIsFollowing} =require("../controller/followingController");


// Importing Controller

//LOGIN AND SIGNUP
router.post('/signup',signUp);
router.post('/login',login);

//POST 
router.post('/createpost',auth,createPost);
router.put('/updatePost',auth,updatePost);
router.delete('/deletePost',auth,deletePost);
router.get('/getallpost',auth,getAllUserPosts);
router.get('/latest-posts',auth,latestPosts);

//USER PROFILE
router.post('/createProfile',auth,createProfile);
router.put('/updateprofiles',auth,updateProfile);
router.get('/getprofiles/:id',auth,getProfile);
router.delete('/deleteprofiles/:id',auth,deleteProfile);

//FOLLOW
router.put('/followuser',auth,followUser);
router.delete('/unfollowuser',auth,unfollowUser);
router.get('/userIsFollowing',auth,userIsFollowing);


module.exports=router;