const db = require("../connection/connection");

const getAllAccounts = (req, res) => {
  const sql =
    "select a.account_id, a.name,a.description,a.default,t.name as type, l.end_balance as balance, v.end_balance as opening_balance from inv.accounts a left outer " +
    "join inv.customers c on a.account_id = c.account_id left outer join inv.vendors s on a.account_id = s.account_id left join inv.ledgers l on l.account_id = a.account_id " +
    "left outer join inv.employees e on a.account_id = e.account_id left outer join inv.account_types t on a.type_id=t.a_type_id " +
    "left outer join inv.ledgers v on v.account_id = a.account_id " +
    "where e.account_id is null and c.account_id is null and s.account_id is null " +
    "and l.ledger_id = (select max(k.ledger_id) from inv.ledgers k where k.account_id = a.account_id) " +
    "and v.ledger_id = (select min(k.ledger_id) from inv.ledgers k where k.account_id = a.account_id and k.type_id = 900) " +
    "order by a.account_id asc limit 5000;";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get All Accounts");
    console.log(result);
    return res.status(200).json(result);
  });
};

const GetAllAccountTypes = (req, res) => {
  const sql =
    "select a_type_id, name from inv.account_types where a_type_id != 1107 and a_type_id != 1106 and a_type_id !=1105;";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get All Account Types");
    console.log(result);
    return res.status(200).json(result);
  });
};

const AddAccountOpeningBal = (req, res) => {
  console.log(req.body);
  const {
    acc_name,
    acc_description,
    acc_type_id,
    acc_notes,
    ledger_notes,
    opening_balance,
    ledger_date,
    ledger_type_id,
  } = req.body;
  const sql = "call inv.sp_add_account_with_opening_balance(?,?,?,?,?,?,?,?);";
  db.query(
    sql,
    [
      acc_name,
      acc_description,
      acc_type_id,
      acc_notes,
      opening_balance,
      ledger_notes,
      ledger_date,
      ledger_type_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res
          .status(500)
          .json({ error: "Failed to Add Account Opening Balance" });
      }
      console.log("Account Added successfully");
      return res
        .status(200)
        .json({ message: "Account Opening Balance Added successfully" });
    }
  );
};

const EditAccountOpeningBal = (req, res) => {
  console.log(req.body);
  const {
    account_id,
    acc_name,
    acc_description,
    acc_type_id,
    acc_notes,
    ledger_notes,
    opening_balance,
    ledger_date,
    ledger_type_id,
  } = req.body;
  const sql = "call inv.sp_edit_account_with_opening_balance(?,?,?,?,?,?);";
  db.query(
    sql,
    [
      account_id,
      acc_name,
      acc_description,
      acc_type_id,
      acc_notes,
      opening_balance,
      ledger_notes,
      ledger_date,
      ledger_type_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res
          .status(500)
          .json({ error: "Failed to Update Account Opening Balance" });
      }
      console.log("Account Update successfully");
      return res
        .status(200)
        .json({ message: "Account Opening Balance Updated successfully" });
    }
  );
};

const getAccountByID = (req, res) => {
  const { account_id } = req.body;
  const sql =
    "select a.*, l.*, ac.name as acc_type from inv.accounts a left outer join inv.ledgers l on a.account_id = l.account_id " +
    "left outer join inv.account_types ac on a.type_id=ac.a_type_id where a.account_id = ? and l.type_id=900;";
  db.query(sql, [account_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Accounts Details by ID");
    return res.status(200).json(result);
  });
};

const CheckAccNameExist = (req, res) => {
  // console.log(req.body);
  const sql =
    "select case when exists (select account_id from inv.accounts where name = ? ) then 1 else 0 end as name;";
  const { name } = req.body;
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to check Name exist" });
    }
    console.log(result);
    return res.status(200).json(result);
  });
};

const CheckDefaultAcc = (req, res) => {
  // console.log(req.body);
  const sql = "select `default` from inv.accounts where account_id = ?;";
  const { account_id } = req.body;
  db.query(sql, [account_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res
        .status(500)
        .json({ error: "Failed to check Default Account exist" });
    }
    console.log(result);
    return res.status(200).json(result);
  });
};

const CheckAccDeleteStatus = (req, res) => {
  // console.log(req.body);
  const sql =
    "select case when exists (select l.ledger_id from inv.accounts a left outer join inv.ledgers l on a.account_id = l.account_id where l.account_id = ? and (l.type_id = 901 or l.type_id = 902 or a.default = 1)) then 1 else 0 end as status;";
  const { account_id } = req.body;
  db.query(sql, [account_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to check Account Status" });
    }
    console.log(result);
    return res.status(200).json(result);
  });
};

const DeleteAccount = (req, res) => {
  // console.log(req.body);
  const sql = "delete from inv.accounts where account_id = ?;";
  const { account_id } = req.body;
  db.query(sql, [account_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to Delete Account" });
    }
    console.log(result);
    return res.status(200).json(result);
  });
};

module.exports = {
  getAllAccounts,
  GetAllAccountTypes,
  AddAccountOpeningBal,
  EditAccountOpeningBal,
  getAccountByID,
  CheckAccNameExist,
  CheckDefaultAcc,
  CheckAccDeleteStatus,
  DeleteAccount,
};
