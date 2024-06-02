const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/user");
const Profile = require("../models/profile");
const ProfileImage = require("../models/profileImage");
const Item = require("../models/item");
const Notification = require("../models/notifications");
const RejectionMessage = require("../models/rejectionMessage");
const ItemClaim = require("../models/itemClaim");
const Chat = require("../models/chat");
const Message = require("../models/message");

router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    res
      .status(200)
      .json({ message: "Login successful", token, isAdmin: user.admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.userId);

    res.status(200).json({ isAdmin: user.admin });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/check-user", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({ message: "User exists" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return res.status(500).json({ message: "Failed to check user" });
  }
});

router.post("/update-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Failed to update password" });
  }
});

router.get("/all-items", verifyToken, (req, res) => {
  res.json({ message: "You have access to the AllItems page!" });
});

router.use(verifyToken);

router.get("/profile", verifyToken, async (req, res) => {
  try {
    console.log("User ID:", req.user);

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User name:", user.fullName);
    console.log("User email:", user.email);

    const profile = await Profile.findOne({ user: req.user });

    let profileData = {};
    if (profile) {
      console.log("Address:", profile.address);
      console.log("Phone Number:", profile.phoneNumber);
      console.log("Date of Birth:", profile.dateOfBirth);
      console.log("Gender:", profile.gender);

      profileData = {
        address: profile.address,
        phoneNumber: profile.phoneNumber,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        idType: profile.idType,
        idNumber: profile.idNumber,
        idImageUrl: profile.idImageUrl,
        idFileName: profile.idFileName, // Include idFileName in profileData
      };
    }

    res.json({
      fullName: user.fullName,
      email: user.email,
      ...profileData,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/profile", verifyToken, async (req, res) => {
  try {
    console.log("User ID:", req.user);

    let profile = await Profile.findOne({ user: req.user });

    if (!profile) {
      profile = new Profile({
        user: req.user,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        idType: req.body.idType,
        idNumber: req.body.idNumber,
        idImageUrl: req.body.idImageUrl,
        idFileName: req.body.idFileName, // Include idFileName in the new profile
      });
    } else {
      profile.address = req.body.address;
      profile.phoneNumber = req.body.phoneNumber;
      profile.dateOfBirth = req.body.dateOfBirth;
      profile.gender = req.body.gender;
      profile.idType = req.body.idType;
      profile.idNumber = req.body.idNumber;
      profile.idImageUrl = req.body.idImageUrl;
      profile.idFileName = req.body.idFileName; // Update idFileName if it exists
    }

    await profile.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/userProfileImage", verifyToken, async (req, res) => {
  try {
    const userId = req.user;

    const profileImage = await ProfileImage.findOne({ user: userId });

    if (!profileImage) {
      return res.status(200).json({ profileImage: null });
    }

    return res.status(200).json({ profileImage });
  } catch (error) {
    console.error("Error fetching user profile image:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/saveImageUrl", verifyToken, async (req, res) => {
  try {
    const { imageUrl } = req.body;

    console.log("User Id:", req.user);

    let profileImage = await ProfileImage.findOne({ user: req.user });

    console.log("Profile Image:", profileImage);

    if (!profileImage) {
      profileImage = new ProfileImage({
        user: req.user,
        imageUrl: imageUrl,
      });
    } else {
      profileImage.imageUrl = imageUrl;
    }

    await profileImage.save();

    res.json({ message: "Image URL saved successfully", profileImage });
  } catch (error) {
    console.error("Error saving image URL:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/removeImageUrl", verifyToken, async (req, res) => {
  try {
    const userId = req.user;

    let profileImage = await ProfileImage.findOne({ user: userId });

    if (profileImage) {
      profileImage.imageUrl = "https://bit.ly/broken-link";
      await profileImage.save();
    }

    res.json({
      success: true,
      message: "Profile image URL removed successfully.",
    });
  } catch (error) {
    console.error("Error removing profile image URL:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to remove profile image URL." });
  }
});

router.post("/post-items", verifyToken, async (req, res) => {
  try {
    const {
      itemName,
      category,
      description,
      location,
      itemType,
      securityQuestion,
      lostFoundDate,
      brand,
      itemColor,
      mainImage,
      additionalImages,
      mainImageEmbedding,
      additionalImagesEmbeddings,
    } = req.body;

    // Assign "Others" to itemColor if it is null or undefined
    const finalItemColor = itemColor || "Others";

    const newItem = new Item({
      user: req.user,
      itemName,
      category,
      description,
      location,
      itemType,
      securityQuestion,
      lostFoundDate,
      brand,
      itemColor: finalItemColor,
      mainImage,
      additionalImages,
      mainImageEmbedding,
      additionalImagesEmbeddings,
      claimed: "unclaimed",
    });

    await newItem.save();

    res
      .status(201)
      .json({ message: "Item posted successfully", item: newItem });
  } catch (error) {
    console.error("Error posting item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/get-items", verifyToken, async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/check-profile-completion", verifyToken, async (req, res) => {
  try {
    // Extract user id from token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

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
      return res.json({ complete: false, message: "Profile image not found" });
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
});

router.get("/check-user-verification", verifyToken, async (req, res) => {
  try {
    // Extract user id from token
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is verified
    if (user.verified) {
      return res.json({ verified: true, message: "User is verified" });
    } else {
      return res.json({ verified: false, message: "User is not verified" });
    }
  } catch (error) {
    console.error("Error checking user verification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/notifications", verifyToken, async (req, res) => {
  try {
    console.log("User ID In Notification:", req.user);
    const notifications = await Notification.find({ userId: req.user });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put(
  "/notifications/:notificationId/mark-as-read",
  verifyToken,
  async (req, res) => {
    try {
      const notificationId = req.params.notificationId;
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      notification.isRead = true;
      await notification.save();
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.delete(
  "/notifications/:notificationId",
  verifyToken,
  async (req, res) => {
    try {
      const notificationId = req.params.notificationId;
      const deletedNotification = await Notification.findByIdAndDelete(
        notificationId
      );
      if (!deletedNotification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get("/get-message", verifyToken, async (req, res) => {
  try {
    console.log("User ID In Message Section:", req.user);

    // Find the message for the userId
    const message = await RejectionMessage.findOne({ userId: req.user });

    if (!message) {
      return res.json({ message: "Message not found" });
    }

    console.log("Message found:", message);

    res.json({ message: "Message retrieved successfully", data: message });
  } catch (error) {
    console.error("Error retrieving message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/delete-message", verifyToken, async (req, res) => {
  try {
    // Attempt to delete the rejection message for the specified user
    const result = await RejectionMessage.findOneAndDelete({
      userId: req.user,
    });

    if (!result) {
      // If no rejection message is found, pass without error
      return res.json({ message: "No rejection message found to delete" });
    }

    res.json({ message: "Rejection message deleted successfully" });
  } catch (error) {
    console.error("Error deleting rejection message:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/item/:itemId", verifyToken, async (req, res) => {
  try {
    const itemId = req.params.itemId;

    // Find the item by ID
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    console.log("Item : ", item);

    res.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/item/:itemId/ownership", verifyToken, async (req, res) => {
  try {
    const itemId = req.params.itemId;

    // Extracting user ID from the token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const item = await Item.findOne({ _id: itemId, user: userId });

    if (item) {
      res.status(200).json({ isOwner: true });
    } else {
      res.status(200).json({ isOwner: false });
    }
  } catch (error) {
    console.error("Error checking item ownership:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-item/:itemId", verifyToken, async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const updatedData = req.body;

    const updatedItem = await Item.findByIdAndUpdate(itemId, updatedData, {
      new: true,
    });

    if (!updatedItem) {
      console.log("Item not found with ID:", itemId);
      return res.status(404).json({ message: "Item not found" });
    }

    console.log("Item updated successfully:", updatedItem);
    res.json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/delete-item/:itemId", async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { deleted: true },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get(
  "/item/:itemId/verification-status",
  verifyToken,
  async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const item = await Item.findById(itemId);

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json({ isVerified: item.verified });
    } catch (error) {
      console.error("Error checking item verification:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

router.get("/item/:itemId/completion-status", verifyToken, async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const requiredFields = [
      item.itemName,
      item.category,
      item.description,
      item.location,
      item.itemType,
      item.securityQuestion,
      item.lostFoundDate,
      item.mainImage,
      item.mainImageEmbedding,
    ];

    const isComplete = requiredFields.every(
      (field) => field && field !== "" && field !== "N/A"
    );

    res.json({ isComplete });
  } catch (error) {
    console.error("Error checking item completion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post(
  "/submit-security-answer/:itemId",
  verifyToken,
  async (req, res) => {
    try {
      const { itemId } = req.params;
      const { answer } = req.body;

      // Extract the user ID from the token
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userIdFromToken = decoded.userId;
      console.log("User ID from token:", userIdFromToken);

      // Find the item using the itemId
      const item = await Item.findById(itemId);
      if (!item) {
        console.log("Item not found");
        return res.status(404).json({ message: "Item not found" });
      }

      // Search for existing item claim using itemId and userId from token
      let itemClaim = await ItemClaim.findOne({
        itemId,
        userId: userIdFromToken,
      });
      console.log("Existing Item Claim:", itemClaim);

      if (!itemClaim) {
        // If item claim not found, create a new one
        itemClaim = new ItemClaim({
          itemId,
          userId: userIdFromToken,
          securityQuestion: item.securityQuestion,
          securityAnswer: answer,
          attempts: 1, // Set attempts to 1 for the first submission
          claimProcessOngoing: true, // Set claim process ongoing to true
        });
      } else {
        // If item claim found, check attempts
        if (itemClaim.attempts >= 3) {
          console.log("Maximum attempts reached");
          return res.status(400).json({ message: "Maximum attempts reached" });
        }

        // Update answer and increment attempts
        itemClaim.securityAnswer = answer;
        itemClaim.attempts += 1;
        itemClaim.claimProcessOngoing = true; // Set claim process ongoing to true
      }

      // Save the item claim
      await itemClaim.save();
      console.log("Item Claim saved:", itemClaim);

      res
        .status(200)
        .json({ message: "Security answer submitted successfully" });
    } catch (error) {
      console.error("Error submitting security answer:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get("/item-claims/:itemId", verifyToken, async (req, res) => {
  const { itemId } = req.params;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userIdFromToken = decoded.userId;

  console.log("Item ID using params : ", req.params);
  console.log("Item ID : ", itemId);
  console.log("User ID : ", userIdFromToken);

  try {
    const itemClaim = await ItemClaim.findOne({
      itemId,
      userId: userIdFromToken,
    });
    if (!itemClaim) {
      return res.status(404).json({ message: "Item claim not found" });
    }
    res.json({ ...itemClaim.toObject(), userIdFromToken });
  } catch (error) {
    console.error("Error fetching item claim:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/item-claims/all/:itemId", verifyToken, async (req, res) => {
  const { itemId } = req.params;
  console.log("Item ID:", itemId);

  try {
    const itemClaims = await ItemClaim.find({
      itemId,
      $or: [
        { claimProcessOngoing: true },
        { claimProcessOngoing: false, claimSuccess: true },
      ],
    }).populate("userId", "fullName email");

    if (!itemClaims.length) {
      return res.status(404).json({ message: "No claims found for this item" });
    }
    res.json(itemClaims);
  } catch (error) {
    console.error("Error fetching item claims:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/reject-item-claim/:claimId", verifyToken, async (req, res) => {
  const { claimId } = req.params;

  console.log("Claim ID using params : ", claimId);

  try {
    // Find the item claim by claim ID
    const itemClaim = await ItemClaim.findById(claimId);
    if (!itemClaim) {
      return res.status(404).json({ message: "Item claim not found" });
    }

    // Update claim process ongoing to false
    itemClaim.claimProcessOngoing = false;

    // Save the updated item claim
    await itemClaim.save();

    res.json({ message: "Item claim process set to false successfully" });
  } catch (error) {
    console.error("Error updating item claim process:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/verify-item-claim/:claimId", verifyToken, async (req, res) => {
  const { claimId } = req.params;
  const { itemId } = req.body;

  try {
    // Find the item claim by claim ID
    const itemClaim = await ItemClaim.findById(claimId);
    if (!itemClaim) {
      return res.status(404).json({ message: "Item claim not found" });
    }

    // Update claim success to true
    itemClaim.claimSuccess = true;
    await itemClaim.save();

    // Update all other claims with the same item ID to set claimProcessOngoing to false
    await ItemClaim.updateMany(
      { itemId: itemId, _id: { $ne: claimId } },
      { claimProcessOngoing: false }
    );

    // Find the item by item ID and update the claimed field to "claimed"
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.claimed = "claimed";
    await item.save();

    res.json({ message: "Item claim verified successfully" });
  } catch (error) {
    console.error("Error verifying item claim:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/show-claimer-info/:itemId", verifyToken, async (req, res) => {
  const { itemId } = req.params;
  try {
    // Find the claim item model with the specified item ID and claimSuccess as true
    const claimItem = await ItemClaim.findOne({ itemId, claimSuccess: true });
    if (!claimItem) {
      return res.status(404).json({ message: "No user found for this item" });
    }

    // Find the user based on the user ID from the claim item model
    const user = await User.findById(claimItem.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's profile based on the user ID
    const profile = await Profile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Send user information to the frontend
    res.json({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: profile.phoneNumber,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/show-poster-info/:itemId", verifyToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const userId = item.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await Profile.findOne({ user: user._id });

    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.json({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: profile.phoneNumber,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// router.post(
//   "/store-item-claim-notification/:itemId",
//   verifyToken,
//   async (req, res) => {
//     try {
//       const { itemId } = req.params;
//       const { message, type, isRead } = req.body;

//       const item = await Item.findById(itemId);
//       if (!item) {
//         return res.status(404).json({ message: "Item not found" });
//       }

//       const userId = item.user;

//       const notification = new Notification({
//         userId,
//         itemId,
//         message,
//         type,
//         isRead,
//       });

//       await notification.save();

//       res.json({ message: "Notification stored successfully" });
//     } catch (error) {
//       console.error("Error storing notification:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   }
// );

// router.post(
//   "/store-item-verified-or-rejected-notification/:itemId",
//   verifyToken,
//   async (req, res) => {
//     try {
//       const { userId, itemId, message, type, isRead } = req.body;

//       const notification = new Notification({
//         userId,
//         itemId,
//         message,
//         type,
//         isRead,
//       });

//       await notification.save();

//       res.json({ message: "Notification stored successfully" });
//     } catch (error) {
//       console.error("Error storing notification:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   }
// );

router.get("/my-items", verifyToken, async (req, res) => {
  try {
    // Extract user ID from the token
    const token = req.headers.authorization.split(" ")[1];
    console.log("Token:", token); // Logging token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userIdFromToken = decoded.userId;
    console.log("User ID from token:", userIdFromToken); // Logging user ID extracted from token

    // Find items with the user ID
    const items = await Item.find({ user: userIdFromToken });
    console.log("Items found:", items); // Logging items found

    res.json(items);
  } catch (error) {
    console.error("Error:", error); // Logging error
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/chat", verifyToken, async (req, res) => {
  const { user1, user2 } = req.body;
  let chat = await Chat.findOne({ users: { $all: [user1, user2] } });
  if (!chat) {
    chat = new Chat({ users: [user1, user2] });
    await chat.save();
  }
  res.json(chat);
});

router.get("/messages/:chatId", verifyToken, async (req, res) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chat: chatId }).populate("sender");
  res.json(messages);
});

router.post("/message", verifyToken, async (req, res) => {
  const { chatId, sender, content } = req.body;
  const message = new Message({ chat: chatId, sender, content });
  await message.save();
  res.json(message);
});

module.exports = router;
