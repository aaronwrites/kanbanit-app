const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {todoRouter} = require('./routes/todo');
const {userRouter} = require('./routes/user')
const app = express();
const path = require('path');
dotenv.config();
app.use(express.json());
app.use("/todos", todoRouter);
app.use("/user", userRouter);
app.use(express.static('public'));


app.get("/", (req, res) => {
    res.redirect("https://kanbanit-aaronh.framer.website/");
})

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        app.listen(process.env.PORT);
	console.log("Database Connection Successful");
        console.log(`Server is running on port ${process.env.PORT}`);
}
    
    catch(e) {
        console.error("MongoDB Connection Failed", e);
    }
    
}
main();
