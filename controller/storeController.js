const db = require("../connection/connection");

const getAllStores = (req, res) => {
  const sql = "select store_id, name from inv.stores;";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get all Stores");
    return res.status(200).json(result);
  });
};

const addStore = (req, res) => {
  //console.log(req.body)
  const {
    name,
    email,
    contact,
    manager_id,
    street_address,
    city,
    state,
    postal_code,
    tax,
  } = req.body;
  const sql = "call inv.add_store(?,?,?,?,?,?,?,?,?);";
  db.query(
    sql,
    [
      name,
      email,
      contact,
      manager_id,
      street_address,
      city,
      state,
      postal_code,
      tax,
    ],
    (err, result) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).json({ error: "Failed to Add Store" });
      }
      console.log("Store Added successfully");
      return res.status(200).json({ message: "Store Added successfully" });
    }
  );
};

const getAllStoreDetails = (req, res) => {
  const sql =
    "select s.*,e.name as manager, l.*,COALESCE(sum(i.unit_instock),0) as total_stock  from inv.stores s left outer join inv.locations l on s.location_id = l.location_id " +
    "left outer join inv.inventories i on s.store_id=i.store_id left outer join inv.employees e on s.manager_id = e.employee_id " +
    "group by s.store_id order by s.store_id desc limit 4999;";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get all Store Details");
    return res.status(200).json(result);
  });
};

const getProductByStoreID = (req, res) => {
  const { store_id } = req.body;
  const sql =
    "select i.unit_instock,i.opening_balance, p.code,p.name as productname,pi.image,p.details, p.product_id,u.name as unit,p.unit_price from inv.stores s left join " +
    "inv.inventories i on s.store_id=i.store_id left join inv.products p on i.product_id=p.product_id left join inv.units u " +
    "on p.unit_id = u.unit_id left join inv.product_images pi on p.product_id = pi.product_id " +
    "where s.store_id= ? and pi.image_id = (select min(k.image_id) from inv.product_images k where k.product_id = i.product_id) order by p.product_id desc limit 3;";

  db.query(sql, [store_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }

    const productsWithImage = result.map((product) => {
      return {
        ...product,
        image: product.image ? product.image.toString("base64") : null,
      };
    });
    console.log("Get all Products by Store ID");
    // console.log(result);
    return res.status(200).json(productsWithImage);
  });
};

const getAllProductByStoreID = (req, res) => {
  const { store_id } = req.body;
  const sql =
    "select i.unit_instock,i.opening_balance, p.code,p.name as productname,p.details, p.product_id,u.name as unit,p.unit_price from inv.stores s left join " +
    "inv.inventories i on s.store_id=i.store_id left join inv.products p on i.product_id=p.product_id left join inv.units u " +
    "on p.unit_id = u.unit_id " +
    "where s.store_id= ? order by p.product_id desc;";

  db.query(sql, [store_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }

    console.log("Get all Products by Store ID");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const getProductFilterSubString = (req, res) => {
  const { store_id, sub_string, str } = req.body;
  console.log(req.body);
  const sql = "call inv.sp_get_product_filter_subString(?,?,?);";

  db.query(sql, [store_id, sub_string, str], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    const productsWithImages = result[0].map((product) => {
      if (product.image) {
        product.image = Buffer.from(product.image).toString("base64");
      }
      return product;
    });

    // const productsWithImage = result.map((product) => {
    //   return {
    //     ...product,
    //     image: product.image ? product.image.toString("base64") : null,
    //   };
    // });
    console.log("Get all Products by Store ID and SubString");
    // console.log(productsWithImages);
    return res.status(200).json(productsWithImages);
  });
};

const getStoreByID = (req, res) => {
  const { store_id } = req.body;
  const sql =
    "select s.*, l.*, e.name as manager from inv.stores s left outer join inv.locations l on s.location_id = l.location_id left outer join inv.employees e on e.employee_id = s.manager_id where s.store_id=?;";

  db.query(sql, [store_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Store Details by ID");
    return res.status(200).json(result);
  });
};

const editStoreApi = (req, res) => {
  //console.log(req.body)
  const {
    store_id,
    name,
    email,
    contact,
    manager_id,
    location_id,
    street_address,
    city,
    state,
    postal_code,
    tax,
  } = req.body;
  const sql = "call inv.sp_edit_store(?,?,?,?,?,?,?,?,?,?,?);";
  db.query(
    sql,
    [
      store_id,
      name,
      email,
      contact,
      manager_id,
      location_id,
      street_address,
      city,
      state,
      postal_code,
      tax,
    ],
    (err, result) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).json({ error: "Failed to update Store" });
      }
      console.log("Store Updated successfully");
      return res.status(200).json({ message: "Store Updated successfully" });
    }
  );
};

const CheckStoreNameExist = (req, res) => {
  // console.log(req.body);
  const sql =
    "select case when exists (select store_id from inv.stores where name = ? ) then 1 else 0 end as name;";
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

const CheckStoreBeforeDel = (req, res) => {
  // console.log(req.body);
  const sql =
    "SELECT s.store_id, CASE WHEN i.store_id IS NOT NULL THEN 1 ELSE 0 END AS inventory, CASE WHEN so.store_id IS NOT NULL THEN 1 ELSE 0 END AS sale, " +
    "CASE WHEN po.store_id IS NOT NULL THEN 1 ELSE 0 END AS purchase FROM inv.stores s LEFT JOIN inv.inventories i ON s.store_id = i.store_id " +
    "LEFT JOIN inv.sale_orders so ON s.store_id = so.store_id LEFT JOIN inv.purchase_orders po ON s.store_id = po.store_id WHERE s.store_id = ?;";
  const { store_id } = req.body;
  db.query(sql, [store_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to check Store Del" });
    }
    console.log(result[0]);
    return res.status(200).json(result[0]);
  });
};

const DelStore = (req, res) => {
  // console.log(req.body);
  const sql = "delete from inv.stores where store_id = ?;";

  const { store_id } = req.body;
  db.query(sql, [store_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to Delete Store" });
    }
    console.log(result);
    return res.status(200).json(result);
  });
};

module.exports = {
  getAllStores,
  addStore,
  getAllStoreDetails,
  getProductByStoreID,
  getStoreByID,
  editStoreApi,
  CheckStoreNameExist,
  getProductFilterSubString,
  getAllProductByStoreID,
  CheckStoreBeforeDel,
  DelStore,
};
