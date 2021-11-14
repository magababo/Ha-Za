const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);
    // 로그인이 안 된 경우 📌 401
    if (!accessTokenData) {
      return res.status(401).json({ message: 'You\'re not logged in' });
    }
    // 로그아웃을 성공한 경우 📌 205
    res.setHeader('authorization', '');
    res.status(205).json({ message: 'logged out successfully' });
  } catch {
    // 잘못된 요청인 경우 📌 400
    res.status(400).json({ message: 'error' });
  }
};
