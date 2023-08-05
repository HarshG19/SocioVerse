import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { searchUser } from "./controllers/users.js";
import { verifyToken } from "./middleware/auth.js";


import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

dotenv.config();
const app = express();
// app.use(express.json());
// app.use(bodyParser.json({ limit: '30mb' }));
// app.use(express.json({ limit: "30mb", extended: true }))
// app.use(express.urlencoded({ limit: "30mb", extended: true, parameterLimit: 50000 }))

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.use(cors());




/* ROUTES WITH FILES */
app.post("/auth/register", register);
app.post("/posts",createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/search", searchUser);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));