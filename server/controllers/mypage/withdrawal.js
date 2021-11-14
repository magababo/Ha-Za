const { users } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);
    // 로그인이 안 된 경우 📌 401
    if (!accessTokenData) {
      return res.status(401).send({ message: 'You\'re not logged in' });
    } else {
      const userInfo = await users.findOne({ where: { id: accessTokenData.id } });
      if (userInfo) {
        await users.destroy({ where: { id: accessTokenData.id } });
        res.setHeader('authorization', '');
        // 회원탈퇴를 성공한 경우 📌 200
        res.status(200).json({ message: 'Successfully withdrawal' });
      } else {
        // 잘못된 요청인 경우#1 📌 400
        res.status(400).json({ message: 'error' });
      }
    }
  } catch {
    // 잘못된 요청인 경우#2 📌 400
    res.status(400).json({ message: 'error' });
  }
};
