const { todos } = require('../../models');
const { isAuthorized } = require('../tokenFunctions');

module.exports = async (req, res) => {
  try {
    const accessTokenData = isAuthorized(req);

    if (!accessTokenData) {
      return res.status(401).send({ message: "You're not logged in" });
    } else {
      // id: to do 아이템의 id
      const { id, type, content } = req.body;

      const todoItem = await todos.findOne({
        where: { id: id }
      });

      if (todoItem) {
        await todos.update(
          {
            type: type,
            content: content
          },
          {
            where: { id: id }
          }
        );

        return res.status(200).json({ message: 'ok' });
      } else {
        res.status(404).json({ message: 'no items are found' });
      }
    }
  } catch (err) {
    res.status(400).json({ message: 'error' });
  }
};
