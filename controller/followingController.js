const User = require('../models/userSchema');

// Follow a user
exports.followUser = async (req, res) => {
    const { followingId } = req.body;
    const loggedInUser = req.user.id;

    try {
        const followUser = await User.findByIdAndUpdate(
            followingId,
            { $push: { followers: loggedInUser } },
            { new: true }
        );
    
        const followingUser = await User.findByIdAndUpdate(
            loggedInUser,
            { $push: { following: followingId } },
            { new: true }
        );
    
        if (!followUser || !followingUser) {
            console.error("Error While Following User");
            return res.status(500).json({ success: false, message: 'Failed to follow user' });
        }
    
        res.status(201).json({
            success: true,
            message: 'User followed successfully',
            followUser,
            followingUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to follow user' });
    }  
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
    const { unfollowUserId } = req.body;
    const loggedInUser = req.user.id;

    try {
        const followUser = await User.findByIdAndUpdate(unfollowUserId, { $pull: { followers: loggedInUser } }, { new: true });
        const followingUser = await User.findByIdAndUpdate(loggedInUser, { $pull: { following: unfollowUserId } }, { new: true });

        res.status(201).json({ success: true, message: 'User Unfollowed successfully', followUser, followingUser });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to unfollow user' });
    }
};

// Retrieve users a given user is following
exports.userIsFollowing = async (req, res) => {
    const userId = req.user.id;

    try {
        // Find the user by ID
        const user = await User.findById(userId).populate({
            path: 'following',
            select: 'name posts', // Selecting only 'name' and 'posts' fields
            populate: {
                path: 'posts',
                options: { sort: { createdAt: -1 }, limit: 1 } // Sorting by createdAt in descending order and limiting to 1 post
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Extract the list of following users
        const followingUsers = user.following;

        res.status(200).json({ success: true, followingUsers });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to retrieve following users' });
    }
};


// Retrieve users a given user Followers
exports.userFollowers = async (req, res) => {
    const userId = req.user.id;

    try {
        // Find the user by ID
        const user = await User.findById(userId).populate({
            path: 'followers',
            select: 'name posts', // Selecting only 'name' and 'posts' fields
            populate: {
                path: 'posts',
                options: { sort: { createdAt: -1 }, limit: 1 } // Sorting by createdAt in descending order and limiting to 1 post
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Extract the list of following users
        const Followers = user.following;

        res.status(200).json({ success: true, Followers });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to retrieve following users' });
    }
};
