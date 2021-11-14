const { users } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');
const crypto = require('crypto');
const Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);
    if (!accessTokenData) {
      // 로그인이 안 된 경우 📌 401
      return res.status(401).send({ message: 'You\'re not logged in.' });
    } else {
      const { password } = req.body;
      let userInfo = await users.findOne({ where: { id: accessTokenData.id } });
      userInfo = Sequelize.getValues(userInfo);
      let salt = userInfo.salt;
      let encryptedPassword = userInfo.password;

      if (password !== '') {
        salt = crypto.randomBytes(64).toString('hex');
        encryptedPassword = crypto
          .pbkdf2Sync(password, salt, 9999, 64, 'sha512')
          .toString('base64');
      }

      await users.update(
        {
          salt: salt,
          password: encryptedPassword,
        },
        { where: { id: accessTokenData.id } }
      );
      // 비밀번호 변경을 성공한 경우 📌 200
      res.status(200).json({ message: 'Information updated' });
    }
  } catch {
    // 잘못된 요청인 경우 📌 400
    res.status(400).json({ message: 'error' });
  }
};
