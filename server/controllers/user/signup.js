const crypto = require('crypto');
const { users } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const salt = crypto.randomBytes(64).toString('hex');
    const encryptedPassword = crypto
      .pbkdf2Sync(password, salt, 9999, 64, 'sha512')
      .toString('base64');

    const accessTokenData = isAuthorized(req);
    // 토큰정보가 있어 중복 유저인 경우 📌 406
    if (accessTokenData) return res.status(406).json({ message: 'you are already a user' });

    // 회원가입 양식을 다 채우지 않은 경우 📌 422
    if (!userId || !password) return res.status(422).json({ message: 'insufficient parameters supplied' });
    // userId가 중복인 경우 📌 409
    const dplctUserId = await users.findAll({ where: { userId: userId } });
    if (dplctUserId.length !== 0) {
      return res.status(409).json({ message: 'conflict: userId' });
    } else {
      users.create({
        userId: userId,
        password: encryptedPassword,
        salt: salt,
      });
      // signup 성공인 경우 📌 201
      return res.status(201).json({ message: 'thank you for signing up!' });
    }
  } catch (err) {
    // 잘못된 요청인 경우 📌 400
    res.status(400).json({ message: 'error' });
  }
};
