import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT_URI
);
export const googleLogin = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ message: "Authorization code is required." });
        }

        // Exchange the authorization code for tokens
        const { tokens } = await oAuth2Client.getToken(code);
        const { id_token } = tokens;

        // Verify the ID token and get user info
        const ticket = await oAuth2Client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(400).json({ message: "Invalid Google token." });
        }

        const { sub: googleId, email, name: fullName, picture: profilePhoto } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, create a new one
            user = new User({
                googleId,
                email,
                fullName,
                profilePhoto,
            });
            await user.save();
        } else {
            // If user exists but doesn't have a googleId, link the account
            if (!user.googleId) {
                user.googleId = googleId;
                if (!user.profilePhoto) {
                    user.profilePhoto = profilePhoto;
                }
                await user.save();
            }
        }

        // At this point, the user exists and is linked. Create a JWT.
        const token = jwt.sign(
            { id: user._id, email: user.email, fullName: user.fullName, profilePhoto: user.profilePhoto },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Set to true if using HTTPS
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days (this was already correct)
        });

        res.status(200).json({
            message: "Google login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePhoto: user.profilePhoto
            }
        });

    } catch (error) {
        console.error("Error during Google login:", error);
        res.status(500).json({ message: "Server error during Google login" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, fullName: user.fullName, profilePhoto: user.profilePhoto },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // <-- CHANGED FROM "1h" to "7d"
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Set to true if using HTTPS
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days (this was already correct)
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePhoto: user.profilePhoto
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }
}
export const updateUserProfile = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated." });
        }

        // Verify token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Get fields from request body
        const { fullName, bio } = req.body;

        // Update fields if they are provided
        if (fullName) user.fullName = fullName;
        if (bio) user.bio = bio;

        // Check if a new profile photo was uploaded
        if (req.file) {
            user.profilePhoto = req.file.path;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser.toJSON() // Send back the updated user object
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token." });
        }
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error while updating profile." });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Full name, email, and password are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const newUser = new User({ fullName, email, password });
        const savedUser = await newUser.save();
        res.status(201).json({ message: "User registered successfully", userId: savedUser.id });

    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const logoutUser = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const check = async (req, res) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ login: false, message: "Not authenticated.", id: null });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            res.clearCookie('token');
            return res.status(404).json({ login: false, message: "User not found.", id: null });
        }

        const userJSON = user.toJSON();
        userJSON.id = user._id.toString();

        return res.status(200).json({
            login: true,
            user: userJSON
        });
    } catch (err) {
        res.clearCookie('token');
        return res.status(401).json({ login: false, message: "Invalid or expired token.", id: null });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required.", id: null });
        }

        // Find the user but exclude sensitive fields for this public-facing endpoint
        const user = await User.findById(userId).select('-password -googleId');

        if (!user) {
            return res.status(404).json({ message: "User not found.", id: null });
        }

        // --- MODIFIED: Send the cleaned-up user object which includes the profilePhoto link ---
        res.status(200).json({ ...user.toJSON(), id: user._id });

    } catch (error) {
        console.error("Error fetching user by ID:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid User ID format.", id: null });
        }
        res.status(500).json({ message: "Server error while fetching user details", id: null });
    }
};
