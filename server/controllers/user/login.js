const crypto = require('crypto');
const { users } = require('../../models');
const { isAuthorized, generateAccessToken, generateRefreshToken } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const accessTokenData = isAuthorized(req);
    console.log(accessTokenData);
    // 토큰정보가 있어 로그인 한 유저인 경우 📌 403
    if (accessTokenData) return res.status(403).json({ message: 'you are already logged in' });
    // 로그인 양식을 다 채우지 않은 경우 📌 417
    if (!userId || !password) return res.status(417).json({ message: 'please fill in all the required fields' });

    const member = await users.findOne({ where: { userId: userId } });
    if (!member) {
      // 가입된 유저가 아닌 경우 📌 404
      return res.status(404).json({ message: 'Invalid user' });
    } else {
      const dbPassword = member.password;
      const salt = member.salt;
      const hashedPassword = crypto
        .pbkdf2Sync(password, salt, 9999, 64, 'sha512')
        .toString('base64');

      if (hashedPassword !== dbPassword) {
        // 비밀번호가 틀린 경우 📌 400
        return res.status(400).json({ message: 'please check your password and try again' });
      } else {
        const accessToken = generateAccessToken(member.dataValues);
        const refreshToken = generateRefreshToken(member.dataValues);
        // 로그인을 성공적인 경우 📌 200
        return res.status(200).json({ accessToken, refreshToken, message: 'logged in successfully' });
      }
    }
  } catch {
    // 잘못된 요청인 경우
    res.status(400).json({ message: 'error' });
  }
};
