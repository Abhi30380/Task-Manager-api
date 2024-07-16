const router = require('express').Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signin", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        } else if (username.length < 4) {
            return res.status(400).json({ message: "Username should have at least 4 characters" });
        }

        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashPass = await bcrypt.hash(password,10);

        const newUser = new User({ username, email, password:hashPass });
        await newUser.save();
        return res.status(200).json({ message: "Sign in success" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/login',async(req,res)=>{
    try{
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "email or password incorrect" });
        }
        const username = existingUser.username;
        bcrypt.compare(password,existingUser.password,(err,data)=>{
            if(data){
                const authClaims = [{name:username},{jti:jwt.sign({},"abhishek")}];
                const token = jwt.sign({authClaims},"abhishek",{expiresIn: "2d"});
                console.log("success");
                res.status(200).json({id:existingUser._id, token: token,username});
            }else{
                return res.status(400).json({ message: "Invalid credentials" });
            }
        })
    }catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
})
module.exports = router;