const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const uploadRouter=require('./routes/uploadRouter');
const db=require('./config/mongoose-connection')
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
const port=process.env.PORT;
app.use('/api/uploads', uploadRouter);

app.listen(port, () => 
    console.log(`Server running on port ${port}`)
);
