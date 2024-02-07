const db = require("../connection/connection");

const getAllInventory = (req, res) => {
  const sql =
    "select p.code, p.name, i.unit_instock, i.opening_balance,s.name as store from inv.inventories i left outer " +
    "join inv.products p on i.product_id = p.product_id left outer join inv.stores s on i.store_id = s.store_id order by i.inventory_id desc limit 4999;";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get all Inventory");
    return res.status(200).json(result);
  });
};

const AddInventory = (req, res) => {
  console.log(req.body);
  const { product_id, store_id, unit_instock, currentDate, t_type_id, t_note } =
    req.body;
  const sql = "call inv.sp_update_quantity_in_store_plus(?,?,?,?,?,?);";
  db.query(
    sql,
    [product_id, store_id, unit_instock, currentDate, t_type_id, t_note],
    (err, result) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).json({ error: "Failed to Add Inventory" });
      }
      console.log("Inventory Added successfully");
      return res.status(200).json({ message: "Inventory Added successfully" });
    }
  );
};

const verifyopeningbalexist = (req, res) => {
  const sql =
    "select case when exists (select 1 from inv.inventories WHERE product_id = ? and store_id = ?) then 1 else 0 end as status;";
  const { product_id, store_id } = req.headers;
  db.query(sql, [product_id, store_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to check balance exist" });
    }
    console.log(result);
    return res.status(200).json(result);
  });
};
const getopeningBal = (req, res) => {
  //console.log(req.headers);
  const { product_id, store_id } = req.headers;
  const sql =
    "select opening_balance, min_stock, max_stock from inv.inventories where product_id = ? and store_id = ?;";
  db.query(sql, [product_id, store_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to get opening balance" });
    }
    console.log("Successfully fetched Opening balance");
    return res.status(200).json(result);
  });
};

const getinvStock = (req, res) => {
  //console.log(req.headers);
  const { product_id, store_id } = req.headers;
  const sql =
    "select unit_instock from inv.inventories where product_id = ? and store_id = ?;";
  db.query(sql, [product_id, store_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to get unit_instock" });
    }
    console.log("Successfully fetched Unit_instock");
    return res.status(200).json(result);
  });
};

const AddOpeningBalance = (req, res) => {
  console.log(req.body);
  const {
    store_id,
    product_id,
    min_stock,
    max_stock,
    opening_balance,
    t_type_id,
    t_note,
  } = req.body;
  const sql = "call inv.sp_add_product_to_Store(?,?,?,?,?,?,?);";
  db.query(
    sql,
    [
      store_id,
      product_id,
      min_stock,
      max_stock,
      opening_balance,
      t_type_id,
      t_note,
    ],
    (err, result) => {
      if (err) {
        console.error("Database get error:", err);
        return res.status(500).json({ error: "Failed to add opening balance" });
      }
      console.log("Successfully added Opening balance");
      return res.status(200).json(result);
    }
  );
};

const EditOpeningBalance = (req, res) => {
  console.log(req.body);
  const { store_id, product_id, opening_balance, mn, mx } = req.body;
  const sql = "call inv.sp_edit_product_to_Store(?,?,?,?,?);";
  db.query(
    sql,
    [store_id, product_id, opening_balance, mn, mx],
    (err, result) => {
      if (err) {
        console.error("Database get error:", err);
        return res
          .status(500)
          .json({ error: "Failed to update opening balance" });
      }
      console.log("Successfully updated Opening balance");
      return res.status(200).json(result);
    }
  );
};

const AddInStock = (req, res) => {
  console.log(req.body);
  const { product_id, store_id, unit_instock, t_type_id, t_note } = req.body;
  const sql = "call inv.sp_update_quantity_in_store_plus(?,?,?,?,?);";
  db.query(
    sql,
    [product_id, store_id, unit_instock, t_type_id, t_note],
    (err, result) => {
      if (err) {
        console.error("Database get error:", err);
        return res.status(500).json({ error: "Failed to add In Stock" });
      }
      console.log("Successfully added In Stock");
      return res.status(200).json(result);
    }
  );
};

const AddOutStock = (req, res) => {
  console.log(req.body);
  const { product_id, store_id, unit_instock, t_type_id, t_note } = req.body;
  const sql = "call inv.sp_update_quantity_in_store_minus(?,?,?,?,?);";
  db.query(
    sql,
    [product_id, store_id, unit_instock, t_type_id, t_note],
    (err, result) => {
      if (err) {
        console.error("Database get error:", err);
        return res.status(500).json({ error: "Failed to add Out Stock" });
      }
      console.log("Successfully added Out Stock");
      return res.status(200).json(result);
    }
  );
};

module.exports = {
  getAllInventory,
  AddInventory,
  getopeningBal,
  verifyopeningbalexist,
  AddOpeningBalance,
  EditOpeningBalance,
  getinvStock,
  AddInStock,
  AddOutStock,
};
