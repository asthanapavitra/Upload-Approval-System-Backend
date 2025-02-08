const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const uploadRouter = require("./routes/uploadRouter");
const db = require("./config/mongoose-connection");
const { loadFaceModels } = require("./utils/faceModelLoader");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Load face-api models before handling requests
loadFaceModels().then(() => {
    console.log("🚀 Server ready to process face recognition!");
});

// Routes
app.use("/api/uploads", uploadRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
