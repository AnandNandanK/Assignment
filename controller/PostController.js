const Post = require('../models/PostModel');
const UserSchema = require("../models/userSchema");

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { title, body } = req.body;
        const userId = req.user.id;

        if (!title || !body || !userId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create the post
        const newPost = new Post({ title, body, userId });
        const postData = await Post.create(newPost);

        // Update user's post array
        const user = await UserSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.posts.push(postData._id);
        await user.save();

        res.status(200).json({ data: postData, message: "Post uploaded successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    try {
        const { postId, title, body } = req.body;

        if (!postId || !title || !body) {
            return res.status(400).json({ message: "postId, title, and body are required fields" });
        }

        // Check if the post exists
        const existingPost = await Post.findById(postId);
        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Update the post
        existingPost.title = title;
        existingPost.body = body;
        const updatedPost = await existingPost.save();

        res.status(200).json({ data: updatedPost, message: "Post updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({ message: "postId is required" });
        }

        // Check if the post exists
        const existingPost = await Post.findById(postId);
        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Delete the post
        await existingPost.deleteOne({ _id: postId });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Retrieve all posts of a specific user
exports.getAllUserPosts = async (req, res) => {
    const userId = req.user.id;
    try {
        const userPosts = await Post.find({ userId });
        res.status(200).json({ data: userPosts, message: "All posts of the specific user fetched successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Retrieve latest posts
exports.latestPosts = async (req, res) => {
    try {
        const userId = req.user.id;

        // Retrieve the latest posts from the followed users
        const latestPosts = await Post.find({ userId })
                                      .sort({ createdAt: -1 })
                                      .limit(10) // Adjust this limit as needed
                                      .populate('userId') // Populate the user details for each post
                                      .exec();

        res.status(200).json({ latestPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
