const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const cookie=require('cookie-parser');
const uploadRouter = require("./routes/uploadRouter");
const userRouter = require('./routes/userRouter');
const notificationRouter=require('./routes/NotificationRouter');
const db = require("./config/mongoose-connection");
const { loadFaceModels } = require("./utils/faceApiModelLoader");
const path=require('path');
const app = express();
const port = process.env.PORT || 5000;
app.set('view engine','ejs');
app.use(cookie());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
// Load face-api models before handling requests
loadFaceModels().then(() => {
    console.log("🚀 Face models loaded successfully!");

    // Connect to MongoDB and start server
   
        app.use("/uploads", uploadRouter);
        app.use("/users", userRouter);
        app.use("/notify",notificationRouter);
        app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch((err) => {
    console.error("❌ Failed to load face models:", err);
});

