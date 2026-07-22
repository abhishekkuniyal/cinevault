import Follow from "../models/Follow.js";
import User from "../models/User.js";
import Activity from "../models/Activity.js";
// FOLLOW a user
async function followUser(req, res) {
  try {
    const { id: follower } = req.user;
    const { userId: following } = req.params;

    if (follower === following) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(following);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFollowing = await Follow.findOne({ follower, following });
    if (alreadyFollowing) {
      return res.status(400).json({ message: "Already following this user" });
    }

    const follow = await Follow.create({ follower, following });

    await User.findByIdAndUpdate(follower, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(following, { $inc: { followersCount: 1 } });
    await Activity.create({
      userId: follower,
      type: "followed_user",
      targetUser: following,
    });
    return res
      .status(201)
      .json({ message: "User followed successfully", follow });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// UNFOLLOW a user
async function unfollowUser(req, res) {
  try {
    const { id: follower } = req.user;
    const { userId: following } = req.params;

    const follow = await Follow.findOneAndDelete({ follower, following });

    if (!follow) {
      return res
        .status(404)
        .json({ message: "You are not following this user" });
    }

    await User.findByIdAndUpdate(follower, { $inc: { followingCount: -1 } });
    await User.findByIdAndUpdate(following, { $inc: { followersCount: -1 } });

    return res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// GET a user's followers
async function getFollowers(req, res) {
  try {
    const { userId } = req.params;

    const followers = await Follow.find({ following: userId }).populate(
      "follower",
      "username email avatarUrl",
    );

    return res.status(200).json({ followers });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// GET who a user is following
async function getFollowing(req, res) {
  try {
    const { userId } = req.params;

    const following = await Follow.find({ follower: userId }).populate(
      "following",
      "username email avatarUrl",
    );

    return res.status(200).json({ following });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

export { followUser, unfollowUser, getFollowers, getFollowing };
