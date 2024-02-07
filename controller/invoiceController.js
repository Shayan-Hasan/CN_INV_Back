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

const GetInvoiceProdBySoId = (req, res) => {
  const { so_id } = req.body;
  //   console.log(journal_id);
  const sql =
    "select p.details,p.code, sh.quantity_shipped, sp.price,sp.discount, sh.invoice_id, i.tax,i.shipment, i.discount " +
    "from inv.sale_order_products sp right join inv.shipments sh on sp.so_id = sh.so_id and sp.product_id = sh.product_id " +
    "left join inv.invoices i on i.so_id = sh.so_id and i.invoice_id = sh.invoice_id inner join " +
    "inv.products p on sh.product_id = p.product_id where sp.so_id = ?;";

  db.query(sql, [so_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to Fetch Invoice Products Records" });
    }
    // console.log("Journal Added successfully");
    console.log("Invoice Details Fetched Successfully.");
    return res.status(200).json(result);
  });
};

const GetInvoiceDetailBySoId = (req, res) => {
  const { so_id } = req.body;
  //   console.log(journal_id);
  const sql =
    "select i.invoice_id,c.contact_name as customer, b.phone1,b.phone2, s.attention_name,b.street as b_street,b.city as b_city, b.state as b_state, b.zip as b_zip , b.country as b_country, " +
    "s.street as s_street,s.city as s_city, s.state as s_state, s.zip as s_zip , s.country as s_country, s.phone as s_phone, u.username as user, c.phone as cus_phone, " +
    "st.name as store, st.email as store_email, st.contact as store_contact, e.name as manager,  " +
    "l.street_address as store_address, l.city as store_city, l.state as store_state, l.postal_code as store_zip " +
    "from inv.sale_orders ss left outer join inv.customers c on ss.customer_id = c.customer_id left outer join " +
    "inv.billing_addresses b on c.billing_address_id= b.b_address_id left outer join " +
    "inv.shipping_addresses s on c.shipping_address_id = s.s_address_id " +
    "left outer join inv.users u on u.user_id = ss.user_id left outer join inv.stores st on st.store_id = ss.store_id " +
    "left outer join inv.locations l on l.location_id = st.location_id " +
    "left outer join inv.invoices i on i.so_id = ss.so_id " +
    "left outer join inv.employees e on e.employee_id = st.manager_id " +
    "where ss.so_id = ?;";

  db.query(sql, [so_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to Fetch Invoice Products Records" });
    }
    // console.log("Journal Added successfully");
    console.log("Invoice Details Fetched Successfully.");
    return res.status(200).json(result);
  });
};

module.exports = {
  GetInvoiceProdBySoId,
  GetInvoiceDetailBySoId,
};
