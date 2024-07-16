const jwt = require("jsonwebtoken");
const local = require("node-localstorage");
const authenticate = (req,res,next)=>{
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    try {
        const decoded = jwt.verify(token, "abhishek");
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: "Invalid token." });
    }
    // const temp = req.header;
    // console.log(temp);
    // res.status(400).json({ message: "Invalid token." });
}
module.exports = authenticate;