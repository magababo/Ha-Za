const { todos } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);
    if (!accessTokenData) {
      return res.status(401).send({ message: "You're not logged in" });
    } else {
      const userId = accessTokenData.id;
      const { id, type, content } = req.body;

      await todos.create({
        userId: userId,
        todoId: id,
        type: type,
        content: content
      });

      return res.status(200).json({
        message: 'ok'
      });
    }
  } catch (err) {
    res.status(400).json({ message: 'error' });
    console.log(err);
  }
};
