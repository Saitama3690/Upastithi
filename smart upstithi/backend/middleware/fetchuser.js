const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "AKSHILisagoodb$oy";

const fetchuser = (req, res, next) => {
    const token = req.header("Authorization"); // Ensure correct header
    if (!token) {
      return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
  
    try {
      const decoded = JWT.verify(token.replace("Bearer ", ""), JWT_SECRET);
      req.user = decoded.user;  // Ensure user object exists
      console.log("Decoded User:", req.user); // Debugging
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
  

module.exports = fetchuser;
