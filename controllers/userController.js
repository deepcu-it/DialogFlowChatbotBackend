import User from "../models/User.js";
import CustomError from "../utils/CustomError.js";
import { signUser } from "../utils/jwt.helper.js";
import sendToken from "../utils/sendToken.js";
import blackListedToken from "../models/blackListedToken.js";

const registerUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomError("User already exists with this email");
        }

        const user = await User.create({ email, password, role });
        const { accessToken, refreshToken } = signUser(user._id);
        sendToken(res, user, accessToken, refreshToken);

    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new CustomError("User does not exist");
        }

        const isMatch = await user.comparePassword(password); // This method must be defined in your schema
        if (!isMatch) {
            throw new CustomError("Invalid credentials");
        }

        const { accessToken, refreshToken } = signUser(user._id);
        sendToken(res, user, accessToken, refreshToken);

    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        const token = req.token;

        await blackListedToken.create({ token });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const username = req.username;

        const user = await User.findOne({ username });
        if (!user) {
            throw new CustomError("User not found");
        }

        res.status(200).json({
            success: true,
            user,
        });

    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, ["email", "role"]);
        res.status(200).json({
            success: true,
            users,
        });
    } catch (e) {
        res.status(400).json({
            success: false,
            message: e.message,
        });
    }
};

export { registerUser, loginUser, logoutUser, getMyProfile, getAllUsers };
