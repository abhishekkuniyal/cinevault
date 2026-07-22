import jwt from "jsonwebtoken";
import userModel from "../models/User.js";
import bcrypt from "bcryptjs";

// register user
export async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const alreadyUserExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (alreadyUserExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "something went wrong", error: error.message });
  }
}

// login user
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const userExists = await userModel.findOne({
      email,
    });

    if (!userExists) {
      return res.status(401).json({ message: "Invalid Email or  password " });
    }
    const comparePassword = await bcrypt.compare(password, userExists.password);

    if (!comparePassword) {
      return res.status(401).json({ message: "Invalid Email or  password " });
    }

    // access token
    const access = jwt.sign(
      {
        id: userExists._id,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" },
    );

    // refresh token
    const refresh = jwt.sign(
      {
        id: userExists._id,
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" },
    );

    const isProduction = process.env.NODE_ENV === "production";

    // access cookies
    res.cookie("accessToken", access, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 1000 * 15,
    });

    // refresh cookie
    res.cookie("refreshToken", refresh, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 1000 * 24 * 7,
    });

    return res.status(200).json({
      message: "Login successfully",
      user: {
        id: userExists._id,
        _id: userExists._id,
        username: userExists.username,
        email: userExists.email,
        bio: userExists.bio || "",
        avatarUrl: userExists.avatarUrl || "",
        followersCount: userExists.followersCount || 0,
        followingCount: userExists.followingCount || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// logout user
export async function logoutUser(req, res) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
}

// get me user
export async function getMe(req, res) {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// get user profile by username
export async function getUserProfile(req, res) {
  try {
    const { username } = req.params;
    const user = await userModel.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      user: {
        id: user._id,
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        followersCount: user.followersCount || 0,
        followingCount: user.followingCount || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

