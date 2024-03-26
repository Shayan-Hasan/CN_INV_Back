const db = require("../connection/connection");

const addPayment = (req, res) => {
  // console.log(req.body)
  const {
    acc_from_id,
    acc_to_id,
    opening_balance,
    acc_notes,
    from_acc_bal,
    type_id,
    to_acc_bal,
  } = req.body;
  const sql = "call inv.sp_add_receipt_payment(?,?,?,?,?,?,?);";
  db.query(
    sql,
    [
      acc_from_id,
      acc_to_id,
      opening_balance,
      acc_notes,
      from_acc_bal,
      type_id,
      to_acc_bal,
    ],
    (err, result) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).json({ error: "Failed to Add Payment" });
      }
      console.log("Payment Added successfully");
      return res.status(200).json({ message: "Payment Added successfully" });
    }
  );
};

const editPayment = (req, res) => {
  // console.log(req.body)
  const {
    payment_id,
    acc_from_id,
    acc_to_id,
    acc_from_id1,
    acc_to_id1,
    amount_paid,
    acc_notes,
    from_acc_bal,
    to_acc_bal,
  } = req.body;

  const sql = "call inv.sp_edit_receipt_payment(?,?,?,?,?,?,?,?,?);";
  db.query(
    sql,
    [
      payment_id,
      acc_from_id,
      acc_to_id,
      acc_from_id1,
      acc_to_id1,
      amount_paid,
      acc_notes,
      from_acc_bal,
      to_acc_bal,
    ],
    (err, result) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).json({ error: "Failed to Update Payment" });
      }
      console.log("Payment Updated successfully");
      return res.status(200).json({ message: "Payment Updated successfully" });
    }
  );
};

const deletePayment = (req, res) => {
  console.log(req.body);
  const { payment_id } = req.body;
  const sql = "call inv.sp_delete_receipt_payment(?);";
  db.query(sql, [payment_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Delete Payment" });
    }
    console.log("Payment Deleted successfully");
    return res.status(200).json({ message: "Payment Deleted successfully" });
  });
};

const getAllPaymentDetail = (req, res) => {
  const sql =
    "select p.payment_id, DATE_FORMAT(p.datetime, '%m/%d/%Y %l:%i:%s %p') as datetime, COALESCE(p.amount_paid, 0) as amount_paid, " +
    " a.name as 'From', b.name as 'To', p.note from inv.payments p left outer join inv.accounts a on p.acc_from_id = a.account_id left outer " +
    " join inv.accounts b on p.acc_to_id = b.account_id where p.type_id = 12 order by p.payment_id desc limit 4999;";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get all Stores");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const getAllPaymentDetail_Pay = (req, res) => {
  const sql =
    "select p.payment_id, DATE_FORMAT(p.datetime, '%m/%d/%Y %l:%i:%s %p') as datetime, COALESCE(p.amount_paid, 0) as amount_paid, " +
    " a.name as 'From', b.name as 'To', p.note from inv.payments p left outer join inv.accounts a on p.acc_from_id = a.account_id left outer " +
    " join inv.accounts b on p.acc_to_id = b.account_id where p.type_id = 11 order by p.payment_id desc limit 4999;";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get all Stores");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const getAcc1BalFrom = (req, res) => {
  const { account_id } = req.body;
  // console.log(req.body);

  const sql =
    "select a.name as 'from', b.name as 'to', p.amount_paid, p.note from inv.payments p left outer join inv.accounts a on p.acc_from_id = a.account_id " +
    "left outer join inv.accounts b on p.acc_to_id = b.account_id where p.payment_id = ? ;";

  db.query(sql, [account_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Balance");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const getAccNamesCash = (req, res) => {
  const sql =
    "select a.account_id, a.name, l.end_balance from inv.accounts a left outer join inv.customers c on " +
    "a.account_id = c.account_id left outer join inv.vendors s on a.account_id = s.account_id left outer join inv.employees e on a.account_id = e.account_id " +
    "left join inv.ledgers l on l.account_id = a.account_id " +
    "where c.account_id is null and s.account_id is null and e.account_id is null and l.ledger_id = (select max(k.ledger_id) from inv.ledgers k where k.account_id = a.account_id);";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get all Accounts");
    return res.status(200).json(result);
  });
};

const getAccNameCusVen = (req, res) => {
  const sql =
    "SELECT a.account_id, a.name, l.end_balance FROM inv.accounts a LEFT JOIN inv.customers c ON a.account_id = c.account_id " +
    "LEFT JOIN inv.vendors s ON a.account_id = s.account_id left join inv.ledgers l on a.account_id = l.account_id left outer join inv.employees e on a.account_id = e.account_id  " +
    "WHERE (c.account_id IS NOT NULL OR s.account_id IS NOT NULL OR e.account_id IS NOT NULL)  " +
    "AND (c.account_id IS NULL OR s.account_id IS NULL OR e.account_id IS NULL) and l.ledger_id = (select max(k.ledger_id) from inv.ledgers k where k.account_id = a.account_id);";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get all Accounts of Customer and Suppliers");
    return res.status(200).json(result);
  });
};

const getPaymentDetailByID = (req, res) => {
  const { payment_id } = req.body;
  // console.log("jsjsj");
  // console.log(req.body);

  const sql =
    "select a.name as 'from', b.name as 'to', p.amount_paid, p.note from inv.payments p left outer join inv.accounts a on p.acc_from_id = a.account_id " +
    "left outer join inv.accounts b on p.acc_to_id = b.account_id where p.payment_id = ? ;";

  db.query(sql, [payment_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Payment Detail");
    // console.log(result);
    return res.status(200).json(result);
  });
};

module.exports = {
  addPayment,
  editPayment,
  deletePayment,
  getAllPaymentDetail,
  getAccNamesCash,
  getAccNameCusVen,
  getAcc1BalFrom,
  getPaymentDetailByID,
  getAllPaymentDetail_Pay,
};
