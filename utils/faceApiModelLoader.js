const path = require("path");
const faceapi = require("face-api.js");
const canvas = require("canvas");

// Monkey patch face-api.js to use node-canvas
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function loadFaceModels() {
    const modelPath = path.join(__dirname, "../models/face_models");

    await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(modelPath, "ssd_mobilenetv1"));
    await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(modelPath, "face_recognition"));
    await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(modelPath, "face_landmark_68"));

    console.log("✅ Face models loaded successfully!");
}

module.exports = { loadFaceModels, faceapi };

