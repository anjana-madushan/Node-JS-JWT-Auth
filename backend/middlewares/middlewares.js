import jsonwebtoken from 'jsonwebtoken';
import User from '../models/user.js';

export const CreateToken = (id) => {
  return jsonwebtoken.sign({ id }, process.env.JWTAUTHSECRET, { expiresIn: '60s' })
}

//this function created to check the token
export const checkToken = async (req, res, next) => {
  try {
    const cookies = req.headers.cookie;

    if (!cookies) {
      return res.status(403).json({ message: "Login first" })
    }
    const token = cookies.split("=")[1];

    if (!token) {
      return res.status(403).json({ message: "A token is required" })
    }
    else {
      const decode = jsonwebtoken.verify(token, process.env.JWTAUTHSECRET);
      req.userId = decode.id;
      next();
    }
  } catch (err) {
    return res.status(401).json({ message: "Error in the token checking", err });
  }
}

//this function created to check the logged user's role
export const checkRole = (requiredRoles) => async (req, res, next) => {
  try {
    const convertedRoles = requiredRoles.map(role => role.toLowerCase());
    const userId = req.userId;
    const user = await User.findById(userId);

    const userRole = user.role;
    if (!convertedRoles.includes(userRole.toLowerCase())) {
      return res.status(403).json({ message: 'You are unauthorized' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error occured in authorization', error });
  }
};