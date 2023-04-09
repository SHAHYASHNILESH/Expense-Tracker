const User = require("../models/userSchema");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Using async-await

exports.register = async (req, res) => {
  // get the data sent by user
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(422).json({ error: "Please fill all the fields" });
  }
  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email address already exists" });
    } else {
      const user = new User({
        name,
        email,
        phone,
        password,
      });

      await user.save();

      res.status(201).json({ message: "User registered successfully" });
      // As this is try-catch if error occurs it will execute catch
    }
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validation
    if (!email || !password) {
      // 422 - Unprocessable entity
      return res.status(422).json({ error: "Please fill all the fields" });
    }

    const userLogin = await User.findOne({ email: email });
    //console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      // jwt(json web token) - unique id
      //const token = await userLogin.generateAuthToken();
      //console.log(token);

      // Creates a cookie which expires after 30 days
    //   res.cookie("jwtoken", token, {
    //     expires: new Date(Date.now() + 25892000000),
    //     httpOnly: true,
    //   });

      if (!isMatch) {
        // 400 - Bad request
        res.status(400).json({ error: "Invalid credentials" });
      } else {
        res.json({ message: "User signed in sucessfully" });
      }
    } else {
      res.status(400).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
  }
};
