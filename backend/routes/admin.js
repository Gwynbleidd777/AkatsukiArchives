const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/user");
const Profile = require("../models/profile");
const ProfileImage = require("../models/profileImage");
const Item = require("../models/item");
const RejectionMessage = require("../models/rejectionMessage");
const Notification = require("../models/notifications");

router.get("/profile", verifyToken, async (req, res) => {
  try {
    // Find all users
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Fetch profile data for each user
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await Profile.findOne({ user: user._id });
        return {
          userId: user._id, // Include user ID
          fullName: user.fullName,
          email: user.email,
          address: profile ? profile.address : "N/A",
          phoneNumber: profile ? profile.phoneNumber : "N/A",
          dateOfBirth: profile ? profile.dateOfBirth : "N/A",
          gender: profile ? profile.gender : "N/A",
          admin: user.admin, // Include whether the user is an admin
        };
      })
    );

    res.json(usersWithProfiles);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/profile/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch profile data for the user
    const profile = await Profile.findOne({ user: userId });

    // Fetch profile image data for the user
    const profileImage = await ProfileImage.findOne({ user: userId });

    // Combine user, profile, and profile image data
    const userData = {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      address: (profile && profile.address) || "N/A",
      phoneNumber: (profile && profile.phoneNumber) || "N/A",
      dateOfBirth: (profile && profile.dateOfBirth) || "N/A",
      gender: (profile && profile.gender) || "N/A",
      admin: user.admin,
      imageUrl: (profileImage && profileImage.imageUrl) || "https://bit.ly/broken-link",
      idType: (profile && profile.idType) || "N/A",
      idNumber: (profile && profile.idNumber) || "N/A",
      idImageUrl: (profile && profile.idImageUrl) || null,
      idFileName: (profile && profile.idFileName) || "N/A",
      verified: user.verified,
      deleted: user.deleted,
    };

    res.json(userData);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/verify/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's verification status
    user.verified = true;
    await user.save();

    res.json({ message: "User verified successfully" });
  } catch (error) {
    console.error("Error verifying user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/delete/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's verification status
    user.deleted = true;
    await user.save();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get(
  "/check-profile-completion/:userId",
  verifyToken,
  async (req, res) => {
    try {
      const userId = req.params.userId;

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if profile exists
      const profile = await Profile.findOne({ user: userId });
      if (!profile) {
        return res.json({ complete: false, message: "Profile incomplete" });
      }

      // Check if all required fields in profile are provided
      if (
        !profile.address ||
        !profile.phoneNumber ||
        !profile.dateOfBirth ||
        !profile.gender ||
        !profile.idType ||
        !profile.idNumber ||
        !profile.idImageUrl ||
        !profile.idFileName
      ) {
        return res.json({ complete: false, message: "Profile incomplete" });
      }

      // Check if profile image exists
      const profileImage = await ProfileImage.findOne({ user: userId });
      if (!profileImage) {
        return res.json({
          complete: false,
          message: "Profile image not found",
        });
      }

      // Check if image URL is provided and not equal to the broken link
      if (
        !profileImage.imageUrl ||
        profileImage.imageUrl.includes("https://bit.ly/broken-link")
      ) {
        return res.json({
          complete: false,
          message: "Profile image URL not provided",
        });
      }

      // If all checks pass, profile is complete
      return res.json({ complete: true, message: "Profile complete" });
    } catch (error) {
      console.error("Error checking profile completion:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.put("/update-profile/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the profile by user ID and update the fields
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          idType: "",
          idNumber: "",
          idImageUrl: "",
          idFileName: "",
        },
      },
      { new: true }
    );

    // Check if the profile was found and updated
    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/store-message/:userId", verifyToken, async (req, res) => {
  try {
    const { userId, adminMessage, rejectionType } = req.body;

    // Check if a message model exists for the userId
    let message = await RejectionMessage.findOneAndUpdate(
      { userId },
      { adminMessage, rejectionType }, // New field values
      { upsert: true, new: true } // Create new if not found, and return updated document
    );

    res.json({ message: "Message stored successfully", data: message });
  } catch (error) {
    console.error("Error storing message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete-message/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete the rejection message for the specified user
    const result = await RejectionMessage.findOneAndDelete({ userId });

    if (!result) {
      return res.json({ message: "No rejection message found to delete" });
    }

    res.json({ message: "Rejection message deleted successfully" });
  } catch (error) {
    console.error("Error deleting rejection message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/store-notification/:userId", verifyToken, async (req, res) => {
  try {
    const { userId, message, type, isRead } = req.body;

    // Create a new notification
    const notification = new Notification({
      userId,
      message,
      type,
      isRead,
    });

    // Save the notification to the database
    await notification.save();

    res.json({ message: "Notification stored successfully" });
  } catch (error) {
    console.error("Error storing notification:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
