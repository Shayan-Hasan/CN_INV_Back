const db = require("../connection/connection");
const addCustomer = (req, res) => {
  console.log(req.body);

  // if (!req.file) {
  //   return res.status(400).json({ error: "No file uploaded" });
  // }
  const {
    name,
    phone,
    email,
    website,
    contact_name,
    contact_phone,
    contact_email,
    notes,
    b_street,
    b_city,
    b_state,
    b_zip,
    b_country,
    b_phone1,
    b_phone2,
    s_street,
    s_city,
    s_state,
    s_zip,
    s_country,
    s_attention_name,
    s_phone,
    acc_name,
    acc_type_id,
    type_id,
    opening_balance,
  } = req.body;

  const profile = req.file.buffer;
  var m = null;
  if (req.file) {
    m = profile;
  }
  // if(!val.isEmail(email)){
  //   return res.status(400).json({ error: 'No file uploaded' });
  // }

  const jsonData = JSON.stringify({
    name: name,
    phone: phone,
    email: email,
    website: website,
    contact_name: contact_name,
    contact_phone: contact_phone,
    contact_email: contact_email,
    notes: notes,
    b_street: b_street,
    b_city: b_city,
    b_state: b_state,
    b_zip: b_zip,
    b_country: b_country,
    b_phone1: b_phone1,
    b_phone2: b_phone2,
    s_street: s_street,
    s_city: s_city,
    s_state: s_state,
    s_zip: s_zip,
    s_country: s_country,
    s_attention_name: s_attention_name,
    s_phone: s_phone,
    acc_name: acc_name,
    acc_type_id: acc_type_id,
    type_id: type_id,
    opening_balance: opening_balance,
  });

  console.log(jsonData);
  const sql = "CALL inv.sp_add_customer(?,?);";
  db.query(sql, [jsonData, m], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Add Customer" });
    }

    const flatData = result.flat();
    const customerObject = flatData.find(
      (obj) => obj.customer_id !== undefined
    );
    const customer_id = customerObject ? customerObject.customer_id : undefined;

    const accountObject = flatData.find((obj) => obj.account_id !== undefined);
    const account_id = customerObject ? accountObject.account_id : undefined;

    console.log(customer_id);
    const results = {
      customer_id: customer_id,
      account_id: account_id,
    };
    console.log(results);
    return res.status(200).json(results);
  });
};

const editCustomer = (req, res) => {
  console.log(req.body);
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const {
    customer_id,
    name,
    phone,
    email,
    website,
    contact_name,
    contact_phone,
    contact_email,
    notes,

    billing_address_id,
    b_street,
    b_city,
    b_state,
    b_zip,
    b_country,
    b_phone1,
    b_phone2,

    shipping_address_id,
    s_street,
    s_city,
    s_state,
    s_zip,
    s_country,
    s_attention_name,
    s_phone,

    account_id,
    acc_type_id,
    type_id,
    opening_balance,
  } = req.body;
  const profile = req.file.buffer;

  const jsonData = JSON.stringify({
    customer_id: customer_id,
    name: name,
    phone: phone,
    email: email,
    website: website,
    contact_name: contact_name,
    contact_phone: contact_phone,
    contact_email: contact_email,
    notes: notes,
    billing_address_id: billing_address_id,
    b_street: b_street,
    b_city: b_city,
    b_state: b_state,
    b_zip: b_zip,
    b_country: b_country,
    b_phone1: b_phone1,
    b_phone2: b_phone2,
    shipping_address_id: shipping_address_id,
    s_street: s_street,
    s_city: s_city,
    s_state: s_state,
    s_zip: s_zip,
    s_country: s_country,
    s_attention_name: s_attention_name,
    s_phone: s_phone,
    account_id: account_id,
    acc_type_id: acc_type_id,
    type_id: type_id,
    opening_balance: opening_balance,
    acc_name: name,
  });
  console.log(jsonData);
  const sql = "CALL inv.sp_edit_customer(?,?);";
  db.query(sql, [jsonData, profile], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Update Customer" });
    }
    console.log("Customer Updated successfully");
    return res.status(200).json({ message: "Customer Updated successfully" });
  });
};

const getCustomerByID = (req, res) => {
  console.log(req.body);
  const { customer_id } = req.body;
  const sql = "call inv.sp_customer_by_id(?);";
  db.query(sql, [customer_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    // console.log(result)
    const productsWithImages = result.map((product) => {
      if (product["0"] && product["0"].profile) {
        product["0"].profile = product["0"].profile.toString("base64");
      }
      return product;
    });
    console.log(productsWithImages);
    console.log("Get Customer Details by ID");
    return res.status(200).json(productsWithImages);
  });
};

const getCustomerOrderListByID = (req, res) => {
  const { customer_id } = req.body;
  const sql = "call inv.sp_get_customer_orders(?);";
  db.query(sql, [customer_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Customer Order List by ID");
    return res.status(200).json(result);
  });
};

const getCustomerOrderDetailByID = (req, res) => {
  const { customer_id } = req.body;
  const sql = "call inv.sp_get_customer_order_details(?);";
  db.query(sql, [customer_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Customer Order Details by ID");
    return res.status(200).json(result);
  });
};

const addCustomerFavListByID = (req, res) => {
  const { customer_id, product_id } = req.body;
  const sql = "call inv.sp_add_customer_fav_product(?,?);";
  db.query(sql, [customer_id, product_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to Add Product in Customer Fav List" });
    }
    console.log("Product Added in Customer Fav List successfully");
    return res
      .status(200)
      .json({ message: "Product Added in Customer Fav List successfully" });
  });
};

const getCustomerFavListByID = (req, res) => {
  const { customer_id } = req.body;
  const sql = "call inv.sp_get_list_customer_fav_product(?);";
  db.query(sql, [customer_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Customer Product Fav List  by ID");
    return res.status(200).json(result);
  });
};

const removeCustomerFavListByID = (req, res) => {
  const { customer_id, product_id } = req.body;
  const sql = "call inv.sp_delete_customer_fav_product(?,?);";
  db.query(sql, [customer_id, product_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to Remove Product from Customer Fav List" });
    }
    console.log("Product Remove from Customer Fav List successfully");
    return res
      .status(200)
      .json({ message: "Product Remove from Customer Fav List successfully" });
  });
};

const getAllCustomers = (req, res) => {
  const sql =
    "SELECT c.*, c.phone AS phones, s.city, s.attention_name, l.end_balance AS opening_balance, k.end_balance AS balance " +
    "FROM inv.customers c LEFT JOIN inv.billing_addresses b ON c.billing_address_id = b.b_address_id LEFT JOIN " +
    "inv.shipping_addresses s ON c.shipping_address_id = s.s_address_id LEFT OUTER JOIN inv.accounts a ON a.account_id = c.account_id " +
    "LEFT OUTER JOIN (SELECT n.end_balance, n.account_id FROM inv.ledgers n WHERE n.ledger_id = (SELECT MIN(m.ledger_id) " +
    "FROM inv.ledgers m WHERE m.account_id = n.account_id and m.type_id = 900)) AS l ON l.account_id = a.account_id " +
    "LEFT OUTER JOIN (SELECT n.end_balance, n.account_id FROM inv.ledgers n WHERE n.ledger_id = (SELECT MAX(m.ledger_id) " +
    "FROM inv.ledgers m WHERE m.account_id = n.account_id)) AS k ON k.account_id = a.account_id " +
    "ORDER BY c.customer_id DESC LIMIT 4900;";
  db.query(sql, (err, result) => {
    //console.log(result);
    const productsWithImages = result.map((product) => {
      return {
        ...product,
        profile: product.profile ? product.profile.toString("base64") : null,
      };
    });

    return res.json(productsWithImages);
  });
};

const getAllCustomersName = (req, res) => {
  const sql =
    'SELECT c.customer_id,c.name as customer, concat(c.customer_id," ", c.name) as name, c.account_id,l.end_balance as balance from inv.customers c left outer join ' +
    "inv.ledgers l on c.account_id = l.account_id where l.ledger_id = (select max(k.ledger_id) from inv.ledgers k where k.account_id = l.account_id);";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Customer All Names");
    return res.status(200).json(result);
  });
};

const CheckCusNameExist = (req, res) => {
  // console.log(req.body);
  const sql =
    "select case when exists (select customer_id from inv.customers where name = ? ) then 1 else 0 end as name;";
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

const CheckCusDeleteStatus = (req, res) => {
  // console.log(req.body);
  const sql =
    "select case when exists (select l.ledger_id from inv.customers a left outer join inv.ledgers l on a.account_id = l.account_id where a.customer_id = ? and (l.type_id = 901 or l.type_id = 902)) then 1 else 0 end as status;";
  const { customer_id } = req.body;
  db.query(sql, [customer_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to check Customer Status" });
    }
    console.log(result);
    return res.status(200).json(result);
  });
};

const DeleteCustomer = (req, res) => {
  // console.log(req.body);
  const sql =
    "delete e, a from inv.customers e left outer join inv.accounts a on e.account_id=a.account_id where e.customer_id= ?;";
  const { customer_id } = req.body;
  db.query(sql, [customer_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to Delete Customer" });
    }
    console.log(result);
    return res.status(200).json(result);
  });
};

module.exports = {
  addCustomer,
  editCustomer,
  getCustomerByID,
  getCustomerOrderListByID,
  getCustomerOrderDetailByID,
  getCustomerFavListByID,
  addCustomerFavListByID,
  removeCustomerFavListByID,
  getAllCustomers,
  getAllCustomersName,
  CheckCusNameExist,
  CheckCusDeleteStatus,
  DeleteCustomer,
};
