import express from "express"
import dotenv from "dotenv" 
import { mongoDB } from "./dbConnect/connection.js";
import authRoute from "./routes/auth.route.js";
//import cookieParser from "cookie-parser";

const app = express()

// Middleware to parse JSON
app.use(express.json());
//app.use(cookieParser()); 

// Connect to MongoDB
mongoDB();

dotenv.config()

const port = process.env.PORT || 3000

// app.post('/api/data', (req, res) => {
    //   console.log(req.body);  // Access the JSON data sent by the client
    //   res.send('Data received');
    // });

app.use("/api/auth", authRoute)
    
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});