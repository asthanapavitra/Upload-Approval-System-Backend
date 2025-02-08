const express = require("express");
const multer = require("multer");
const faceapi = require("../utils/faceModelLoader").faceapi;
const canvas = require("canvas");

const Upload = require("../models/upload");
const User = require("../models/userModel");

const router = express.Router();

// Multer Setup for File Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @route   POST /api/uploads
 * @desc    Upload an image & detect users using Face Recognition
 * @access  Public
 */
router.post("/", upload.single("file"), async (req, res) => {
    try {
        const { uploaderId } = req.body;
        const fileBuffer = req.file.buffer;

        // Convert buffer to Image for face detection
        const img = await canvas.loadImage(fileBuffer);
        const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

        if (!detections.length) {
            return res.status(400).json({ message: "No faces detected in the image" });
        }

        // Fetch stored users from DB
        const users = await User.find({});
        const matchedUsers = [];

        for (let detectedFace of detections) {
            const detectedDescriptor = detectedFace.descriptor;

            for (let user of users) {
                if (user.faceData) {
                    const dbDescriptor = Object.values(user.faceData); // Convert stored face data to array
                    const distance = faceapi.euclideanDistance(detectedDescriptor, dbDescriptor);

                    if (distance < 0.5) { // Face match threshold
                        matchedUsers.push(user._id);
                    }
                }
            }
        }

        if (!matchedUsers.length) {
            return res.status(400).json({ message: "No matching users found" });
        }

        // Create upload entry in DB
        const newUpload = new Upload({
            uploader: uploaderId,
            fileUrl: "mock_url_for_storage", // Replace with actual storage URL later
            detectedUsers: matchedUsers.map(userId => ({ user: userId, status: "pending" }))
        });

        await newUpload.save();
        res.status(201).json({ message: "Upload created, waiting for approvals", uploadId: newUpload._id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


// router.post("/:uploadId/approve", async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const upload = await Upload.findById(req.params.uploadId);

//         if (!upload) {
//             return res.status(404).json({ message: "Upload not found" });
//         }

//         // Find the user in the detectedUsers array
//         const userApproval = upload.detectedUsers.find(user => user.user.toString() === userId);

//         if (!userApproval) {
//             return res.status(403).json({ message: "You are not in this upload" });
//         }

//         // Update status to "approved"
//         userApproval.status = "approved";

//         // Check if all detected users have approved
//         upload.checkApproval();
//         await upload.save();

//         res.json({ message: "Approval granted", finalStatus: upload.finalStatus });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// });
// router.post("/:uploadId/reject", async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const upload = await Upload.findById(req.params.uploadId);

//         if (!upload) {
//             return res.status(404).json({ message: "Upload not found" });
//         }

//         const userApproval = upload.detectedUsers.find(user => user.user.toString() === userId);

//         if (!userApproval) {
//             return res.status(403).json({ message: "You are not in this upload" });
//         }

//         // Update status to "rejected"
//         userApproval.status = "rejected";

//         // If any user rejects, mark entire upload as "rejected"
//         upload.finalStatus = "rejected";
//         await upload.save();

//         res.json({ message: "Upload rejected", finalStatus: upload.finalStatus });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// });
// router.get("/:uploadId/status", async (req, res) => {
//     try {
//         const upload = await Upload.findById(req.params.uploadId);

//         if (!upload) {
//             return res.status(404).json({ message: "Upload not found" });
//         }

//         res.json({ finalStatus: upload.finalStatus, detectedUsers: upload.detectedUsers });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// });
// router.get("/pending/:userId", async (req, res) => {
//     try {
//         const pendingUploads = await Upload.find({
//             "detectedUsers.user": req.params.userId,
//             "detectedUsers.status": "pending"
//         });

//         res.json(pendingUploads);

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// module.exports = router;
