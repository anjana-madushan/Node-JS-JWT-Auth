import bcrypt from 'bcrypt';
import User from "../models/user.js";
import { CreateToken } from '../middlewares/token.js';

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
    });

    await user.save();
    return res.status(201).json({ message: "Account Creation is success, Login to your account", User: user })//sending the new user details with token as a message for the response

  } catch (err) {
    console.error(err)
    return res.status(400).json({ message: "Error in saving user in DB" });
  }

}

