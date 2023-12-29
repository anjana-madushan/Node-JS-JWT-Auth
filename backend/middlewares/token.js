import jsonwebtoken from 'jsonwebtoken';

export const CreateToken = (id) => {
  return jsonwebtoken.sign({ id }, process.env.JWTAUTHSECRET, { expiresIn: '30s' })
}

let decode;

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
      decode = jsonwebtoken.verify(token, process.env.JWTAUTHSECRET);
      req.userId = decode._id;
      next();
    }
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" })
    console.log(err)
  }
}