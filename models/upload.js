const mongoose = require("mongoose");

// Schema for maintaining individual user approvals
const StatusSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Detected user
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  }, // Approval status
});

const UploadSchema = new mongoose.Schema(
  {
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Who uploaded
    fileUrl: { type: Buffer, required: true }, // File storage URL (S3, Firebase, etc.)
    detectedUsers: [StatusSchema], // List of detected users and their approval status
    finalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    }, // Overall status
  },
  { timestamps: true }
);

// Function to check approval status before finalizing upload
UploadSchema.methods.checkApproval = function () {
  // If any user rejects, mark as "rejected"
  if (this.detectedUsers.some((user) => user.status === "rejected")) {
    this.finalStatus = "rejected";
  }
  // If all detected users approve, mark as "approved"
  else if (this.detectedUsers.every((user) => user.status === "approved")) {
    this.finalStatus = "approved";
  }
};

module.exports = mongoose.model("upload", UploadSchema);
