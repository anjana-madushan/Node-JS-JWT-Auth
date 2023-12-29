import jsonwebtoken from 'jsonwebtoken';

export const CreateToken = (id) => {
  return jsonwebtoken.sign({ id }, process.env.JWTAUTHSECRET, { expiresIn: '30s' })
}

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
      jsonwebtoken.verify(token, process.env.JWTAUTHSECRET, (err, user) => {
        if (err) {
          return res.status(401).json({ message: "Invalid Token" })
        }
        req.userId = user.id;
      });
      next();
    }
  } catch (err) {
    return res.status(401).json({ message: "Error in the token checking" });
  }
}