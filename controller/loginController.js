const db = require("../connection/connection");

const userLogin = (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  const query =
    "select user_id, role_desc from inv.users where username = ? and password = ? ;";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      return res.json({ status: "500", message: "Login Fail" });
    }
    if (results.length > 0) {
      // return res.json({ status: '200', message: 'Success' });
      return res.status(200).json(results);
    } else {
      return res.status(500).json(results);
    }
  });
};

module.exports = {
  userLogin,
};
