const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {todoRouter} = require('./routes/todo');
const {userRouter} = require('./routes/user')
const app = express();
const axios = require('axios');
dotenv.config();
app.use(express.json());
app.use("/todos", todoRouter);
app.use("/user", userRouter);
app.use(express.static('public'));


app.get("/", (req, res) => {
    res.redirect("https://kanbanit-aaronh.framer.website/");
})

const url = "https://kanbanit-app.onrender.com/";
const interval = 900000;


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

function reloadWebsite() {
    axios.get(url)
    .then(response => {
        console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
        console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    })
}

setInterval(reloadWebsite, interval);