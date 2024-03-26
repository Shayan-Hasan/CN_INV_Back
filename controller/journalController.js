const db = require("../connection/connection");

const addJournal = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  //   console.log(jsonData);
  const sql = "CALL inv.sp_add_journal_ledger(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Add Journal" });
    }
    console.log("Journal Added successfully");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const editJournal = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "CALL inv.sp_edit_journal_ledger(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Update Journal" });
    }
    console.log("Journal Update successfully");
    console.log(result);
    return res.status(200).json(result);
  });
};

const getAllJournals = (req, res) => {
  const sql =
    "select j.journal_id, COALESCE(l.adjustment, 0) as amount, " +
    "DATE_FORMAT(l.datetime, '%m/%d/%Y %l:%i:%s %p') as datetime, a.name as account, " +
    "j.notes from inv.journal_ledgers j left outer join inv.ledgers l on " +
    " j.ledger_id = l.ledger_id left outer join inv.accounts a on l.account_id = a.account_id";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get all Journals");
    return res.status(200).json(result);
  });
};

const getJournalById = (req, res) => {
  const { journal_id } = req.body;
  //   console.log(journal_id);
  const sql =
    "select a.account_id,l.ledger_id, a.name as account, l.adjustment as amount, l.type_id, j.notes , " +
    "case when l.type_id = 902 then l.adjustment else 0 end as credit, " +
    "case when l.type_id = 901 then l.adjustment else 0 end as debit " +
    "from inv.journal_ledgers j left outer join inv.ledgers l on j.ledger_id = l.ledger_id left outer join " +
    "inv.accounts a on l.account_id = a.account_id where j.journal_id = ? ;";

  db.query(sql, [journal_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Fetch Journal Records" });
    }
    // console.log("Journal Added successfully");
    console.log(result);
    return res.status(200).json(result);
  });
};

const deleteJournalById = (req, res) => {
  const { journal_id } = req.body;
  //   console.log(journal_id);
  const sql = "call inv.sp_delete_journal_ledger(?);";

  db.query(sql, [journal_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Fetch Journal Records" });
    }
    // console.log("Journal Added successfully");
    console.log("Journal Deleted successfully");
    return res.status(200).json({ message: "Journal Deleted successfully" });
  });
};

module.exports = {
  addJournal,
  getAllJournals,
  getJournalById,
  editJournal,
  deleteJournalById,
};
