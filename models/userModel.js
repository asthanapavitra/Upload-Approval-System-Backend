const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    faceData: Object, // Face descriptor for recognition (face-api.js)

    profilePicture: { type: String }, // Optional: Store profile image URL

    approvalPreference: {
      type: String,
      enum: ["manual", "auto-approve"],
      default: "manual",
    }, // If "auto-approve", user doesn’t need to approve manually

    pendingApprovals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Upload",
      },
    ], // List of pending uploads requiring user approval
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
