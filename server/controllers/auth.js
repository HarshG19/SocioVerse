import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  // console.log(req.body.body);
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      location,
      occupation,
      picture
    } = req.body.body;

    // const salt = await bcrypt.genSalt();
    // const passwordHash = await bcrypt.hash(password);
    // console.log(salt)
    
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: password,
      picturePath: picture,
      friends: [],
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    // console.log(savedUser);
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body.body;
    // console.log(email,password);
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = password===user.password;
    // console.log(isMatch,user);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
