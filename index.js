import express from "express"
import dotenv from "dotenv" 
import { mongoDB } from "./dbConnect/connection.js";
import authRoute from "./routes/auth.route.js";
import imgRoute from "./routes/img.route.js"
import cookieParser from "cookie-parser";

const app = express()

// Middleware 
app.use(express.json()); // to parse JSON

app.use(cookieParser()); // used to parse and access the cookies


// Connect to MongoDB
mongoDB();

dotenv.config()

const port = process.env.PORT || 3000

// app.post('/api/data', (req, res) => {
    //   console.log(req.body);  // Access the JSON data sent by the client
    //   res.send('Data received');
    // });

app.use("/api/auth", authRoute)
app.use("/api", imgRoute)
    
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});