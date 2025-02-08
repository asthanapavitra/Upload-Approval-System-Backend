const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    faceData: Object, // Face descriptor for recognition (face-api.js)
    password: { type: String },
    profilePicture: { type: Buffer }, // Optional: Store profile image
    pendingUploads: [{ type: mongoose.Schema.Types.ObjectId, ref: "upload" }],
    approvalPreference: {
      type: String,
      enum: ["manual", "auto-approve"],
      default: "manual",
    }, // If "auto-approve", user doesn’t need to approve manually

    pendingApprovals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "upload",
      },
    ], // List of pending uploads requiring user approval

    uploads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "upload",
      },
    ], // List of uploads/posts created by this user
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);

