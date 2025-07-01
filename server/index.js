const express = require("express");
const cors = require("cors")
require("dotenv").config();
const connectDB = require("./configs/database");
const {clerkMiddleware} = require("@clerk/express");
const { serve } = require("inngest/express");
const { inngest, functions } = require( "./inngest/index");
const showRoutes = require("./routes/showRoutes");
const bookinRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");


const app = express();
const port = process.env.PORT;

// connect db
connectDB();


// middlewares
app.use(express.json());
app.use(clerkMiddleware());
app.use(cors());


// API Routes
app.get("/",(req,res) => res.send("Server is Live!"));
app.use("/api/inngest",serve({client:inngest, functions}));
app.use("/api/show",showRoutes)
app.use("/api/booking",bookinRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/user",userRoutes);


app.listen(port, ()=>console.log(`Server listening at http://localhost:${port}`));


