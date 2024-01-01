import bcrypt from 'bcrypt';
import User from "../models/user.js";
import { CreateToken } from '../middlewares/middlewares.js';
import jsonwebtoken from 'jsonwebtoken';

export const signUp = async (req, res) => {

  const { name, mobile, email, password, role } = req.body;
  //validation for all the input fields
  if (!name || !mobile || !email || !password) {
    return res.status(422).json({ message: "All feilds should be filled" })
  }
  try {
    let existingUser;
    //chaecking whether user already sign up or not based on the email
    try {
      existingUser = await User.findOne({ $or: [{ email: email }, { mobile: mobile }] });
    } catch (err) {
      console.error(err);
    }

    if (existingUser) {
      if (existingUser.email == email) {
        return res.status(409).json({ message: "A User is already signUp with this email" })
      }
      else if (existingUser.mobile == mobile) {
        return res.status(409).json({ message: "A User is already signUp with this mobile" })
      }
    }

    const salt = await bcrypt.genSalt(6)
    //hashsync is a function that can hasing the password
    const hashedpassword = await bcrypt.hash(password, salt);

    //creating a new User
    const user = new User({
      name,
      mobile,
      email,
      password: hashedpassword,
      role: role,
    });

    await user.save();
    return res.status(201).json({ message: "Account Creation is success, Login to your account", User: user })//sending the new user details with token as a message for the response

  } catch (err) {
    console.error(err)
    return res.status(400).json({ message: "Error in saving user in DB" });
  }

}

export const login = async (req, res) => {

  const { email, password } = req.body;

  //checking whether pasword and login fields are filled or not 
  if (!email || !password) {
    return res.status(422).json({ message: "All feilds should be filled" })
  }

  let loggedUser;

  try {
    loggedUser = await User.findOne({ email: email });

    if (!loggedUser) {
      return res.status(404).json({ message: "Email is not found, Check it and try again" })
    }
    //checking password and compare it with exist user's password in the db
    const isPasswordCorrect = bcrypt.compareSync(password, loggedUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password, Check it and try again" })
    }
    const token = CreateToken(loggedUser._id);

    //Create and setting a cookie with the user's ID and token
    res.cookie(String(loggedUser._id), token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 59),
      httpOnly: true,//if this option isn't here cookie will be visible to the frontend
      sameSite: "lax"
    })

    //we send this msg along with the token and user details
    return res.status(200).json({ message: "Successfully logged in", User: loggedUser, token })
  } catch (err) {
    console.log(err)
  }
}

export const logout = (req, res) => {
  const cookies = req.headers.cookie;//request cookie from the header

  //extracting token from the cookies
  const previousToken = cookies.split("=")[1];

  //if token is not found return this response
  if (!previousToken) {
    return res.status(400).json({ message: "Couldn't find token" });
  }

  //varifying token using secret key from the environmental variables
  jsonwebtoken.verify(String(previousToken), process.env.JWTAUTHSECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });//if not verified return this error
    }
    res.clearCookie(`${user.id}`);
    req.cookies[`${user.id}`] = "";
    return res.status(200).json({ message: "Successfully Logged Out" });
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const allusers = await User.find();
    if (!allusers) {
      return res.status(404).json({ message: "There are not any users" });
    }
    else {
      res.status(200).json({ allusers })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error in getting the Users" })
  }
}