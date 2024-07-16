const express = require("express");
require("dotenv").config();
const connectDB = require('./config/db');
const cors = require('cors');
const userAPI = require("./routes/user");
const taskAPI = require("./routes/task");
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const PORT = 1000;

app.use(cors());
app.use(express.json());

app.use('/api/v1', userAPI);
app.use('/api/v2',taskAPI);

app.use("/", (req, res) => {
    res.send("Hello from backend side");
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}....`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database", error);
});
