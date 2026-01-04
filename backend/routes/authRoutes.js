const authMiddleware = require("../middleware/auth");
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

router.post("/signup",async(req,res)=>{
    try{
        const { username,password} = req.body;

        if(!username || !password){
            return res.status(400).json({massage: "All fields required"});
        }
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({massage:"user already exists"});
        }
        const handedPassword = await bcrypt.hash(password ,10);
        const user = new User({
            username,
            password:handedPassword
        });
        await user.save();

        res.status(201).json({message: "signup succesfull"});

    }catch (err) {
        console.error("SIGNUP ERROR 👉", err);
        res.status(500).json({
            message: "signup failed",
            error: err.message
        });
    }

});
module.exports = router;

const jwt = require("jsonwebtoken");

/* ---------------- LOGIN ---------------- */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (err) {
    console.error("LOGIN ERROR 👉", err);
    res.status(500).json({
      message: "login failed",
      error: err.message
    });
  }
});
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You have accessed a protected route",
    user: req.user
  });
});
