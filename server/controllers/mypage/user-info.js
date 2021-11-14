const { users } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);
    if (!accessTokenData) {
      // 로그인이 안 된 경우 📌 401
      return res.status(401).send({ message: 'You\'re not logged in' });
    } else {
      // 로그인이 된 경우 📌 200
      const userInfo = await users.findOne({ where: { id: accessTokenData.id } });
      res.status(200).json({
        data: {
          userId: userInfo.userId,
          password: userInfo.password,
          salt: userInfo.salt
        },
        message: 'ok'
      });
    }
  } catch (err) {
    // 잘못된 요청인 경우 📌 400
    res.status(400).json({ message: 'error' });
  }
};
