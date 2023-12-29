import jsonwebtoken from 'jsonwebtoken';

export const CreateToken = (id) => {
  return jsonwebtoken.sign({ id }, process.env.JWTAUTHSECRET, { expiresIn: '20min' })
}