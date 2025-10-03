import User from "../models/User.js";
import Social from '../models/Social.js';
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
import otpGenerator from 'otp-generator';
import sendOTPEmail from '../utils/mailer.js';

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

        // Exchange code for tokens and verify
        const { tokens } = await oAuth2Client.getToken(code);
        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload) {
            return res.status(400).json({ message: "Invalid Google token." });
        }

        const { sub: googleId, email, name: fullName, picture: profilePhoto } = payload;
        let user = await User.findOne({ email });

        if (!user) {
            // This block handles first-time Google registration
            const newUser = new User({ googleId, email, fullName, profilePhoto });
            user = await newUser.save();

            try {
                // Create the corresponding Social document
                const newSocial = new Social({ userId: user._id });
                await newSocial.save();
            } catch (socialError) {
                // **Safety Net:** If social creation fails, delete the new user
                await User.findByIdAndDelete(user._id);
                throw socialError; // Send error to the outer catch block
            }
        } else {
            // This block handles existing users logging in with Google
            if (!user.googleId) {
                user.googleId = googleId;
                if (!user.profilePhoto) user.profilePhoto = profilePhoto;
                await user.save();
            }
        }

        // Create JWT and send response
        const token = jwt.sign(
            { id: user._id, email: user.email, fullName: user.fullName },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Google login successful",
            user: { id: user._id, fullName: user.fullName, email: user.email, profilePhoto: user.profilePhoto }
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

        if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in." });
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

export const getAllUsers = async (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUserId = decoded.id;

        // Find the current user's social document to get their friends list
        const social = await Social.findOne({ userId: currentUserId });

        // Create a list of user IDs to exclude: the user themselves and their friends.
        // If the user has no social document yet, they have no friends.
        const friendsIds = social ? social.friends : [];
        const exclusionList = [currentUserId, ...friendsIds];

        // Build the query to find all users whose ID is "not in" the exclusion list
        const query = { _id: { $nin: exclusionList } };

        // Find users based on the constructed query, selecting only necessary fields
        const users = await User.find(query).select('_id fullName profilePhoto email');

        // Map the results to format them with 'id' instead of '_id'
        const formattedUsers = users.map(user => ({
            id: user._id,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
            email: user.email,
        }));

        res.status(200).json(formattedUsers);

    } catch (error) {
        console.error("Error fetching users:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token." });
        }
        res.status(500).json({ message: "Server error while fetching users" });
    }
};

export const sendOtp = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ message: "A verified user with this email already exists." });
        }

        // If no user exists, create a new instance
        if (!user) {
            user = new User({ email });
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
        });

        // Update the user document's fields
        user.fullName = fullName;
        user.password = password; // Set the plain-text password here
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        user.isVerified = false;

        // Now, save the user. This will trigger the pre-save hook to hash the password.
        await user.save();

        await sendOTPEmail(email, otp);

        res.status(200).json({ message: "OTP sent successfully. Please check your email." });

    } catch (error) {
        console.error("Error during OTP sending:", error);
        res.status(500).json({ message: "Server error during OTP sending" });
    }
};

export const verifyOtpAndRegister = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required." });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found. Please register first." });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        
        user.isVerified = true;
        user.otp = undefined;       
        user.otpExpires = undefined;
        const savedUser = await user.save();

        // Create the associated Social document
        try {
            const newSocial = new Social({ userId: savedUser.id });
            await newSocial.save();
        } catch (socialError) {
            console.error("Error creating social document after verification:", socialError);
            // This is a non-critical error for the user, but should be logged.
        }

        // Automatically log the user in by creating a JWT
        const token = jwt.sign(
            { id: savedUser.id, email: savedUser.email, fullName: savedUser.fullName },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie('token', token, {
            httpOnly: true, secure: true, sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "✅ Registration successful!",
            user: { id: savedUser.id, fullName: savedUser.fullName, email: savedUser.email, profilePhoto: savedUser.profilePhoto }
        });

    } catch (error) {
        console.error("Error during OTP verification:", error);
        res.status(500).json({ message: "Server error during OTP verification" });
    }
};