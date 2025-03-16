const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema(
    {
      name: { type: String, required: true, trim: true },
  
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      },
  
      password: {
        type: String,
        required: true,
        minlength: 8,
      },
  
     
    },
  );
  
  

  
const User = mongoose.model("User", userSchema, "User");
module.exports = User;

  // { timestamps: true }