const db = require("../connection/connection");
const fs = require("fs");

const getProduct = (req, res) => {
  const userInput = req.body.userInput;

  if (!userInput) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const sql = "INSERT INTO inv.users (name) VALUES (?)";
  db.query(sql, [userInput], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    console.log("Record inserted successfully");
    return res.json({ message: "Record inserted successfully" });
  });
};

const getProducts = (req, res) => {
  const sql =
    "SELECT distinct p.product_id, p.code,p.name,p.details,p.active_product,p.display_product, p.discount,p.unit_price, " +
    "u.name as unit_id, c.name as category_id, b.name as brand_id,i.image FROM inv.products p LEFT OUTER JOIN ( SELECT  " +
    "product_id,MIN(image_id) AS min_image_id FROM inv.product_images GROUP BY product_id ) min_images " +
    "ON p.product_id = min_images.product_id LEFT OUTER JOIN inv.product_images i ON min_images.product_id = i.product_id " +
    "AND min_images.min_image_id = i.image_id LEFT OUTER JOIN inv.units u ON p.unit_id = u.unit_id LEFT OUTER JOIN " +
    "inv.categories c ON p.category_id = c.category_id LEFT OUTER JOIN inv.brands b ON p.brand_id = b.brand_id " +
    "ORDER BY p.product_id DESC LIMIT 5000;";
  db.query(sql, (err, result) => {
    //console.log(result);
    const productsWithImages = result.map((product) => {
      return {
        ...product,
        image: product.image ? product.image.toString("base64") : null,
      };
    });
    // console.log(productsWithImages)
    //res.send('Hello, World!');
    return res.json(productsWithImages);
  });
};

const getProductsByStoreId = (req, res) => {
  console.log(req.headers.store_id);
  const sql =
    "SELECT p.product_id, p.name, p.code FROM inv.products p INNER JOIN inv.inventories i ON p.product_id=i.product_id WHERE i.store_id = ?";

  // Access store_id from headers
  const store_id = req.headers.store_id;

  db.query(sql, [store_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // console.log(result);
    return res.json(result);
  });
};

const addProducts = (req, res) => {
  console.log(req.body);

  const {
    code,
    name,
    details,
    unit_price,
    discount,
    unit_id,
    category_id,
    brand_id,
    display_product,
    active_product,
  } = req.query;
  const sql =
    "insert into inv.products (code, name, details, unit_price,discount,unit_id,category_id,brand_id,display_product,active_product) values (?,?,?,?,?,?,?,?,?,?)";
  db.query(
    sql,
    [
      code,
      name,
      details,
      unit_price,
      discount,
      unit_id,
      category_id,
      brand_id,
      display_product || null,
      active_product || null,
    ],
    (err, res) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      console.log("Product Added successfully");
      return res.json({ message: "Product Added successfully" });
    }
  );
};

const addProduct = (req, res) => {
  const {
    code,
    name,
    details,
    unit_price,
    discount,
    unit_id,
    category_id,
    brand_id,
    display_product,
    active_product,
    cost_price,
  } = req.body;
  var m = null;
  if (req.file) {
    m = req.file.buffer;
  }
  const sql = "CALL inv.sp_add_product(?,?,?,?,?,?,?,?,?,?,?,?);";
  console.log(req.body);
  db.query(
    sql,
    [
      code,
      name,
      details,
      unit_price,
      discount,
      unit_id,
      category_id,
      brand_id,
      display_product,
      active_product,
      m,
      cost_price,
    ],
    (err, result) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).json({ error: "Failed to Add Product" });
      }

      // Extract product_id from the result and return it
      // const product_id = result[0][0].product_id;
      console.log("Product Added successfully. Product ID:", result);
      return res.status(200).json(result);
    }
  );
};

const getAllProductsInv = (req, res) => {
  const sql =
    "select p.product_id, p.code, p.name, COALESCE(sum(i.unit_instock),0) as unit_instock, p.unit_price, u.name as unit," +
    "COALESCE(sum(i.opening_balance),0) as opening_balance from inv.products p inner join inv.inventories i on p.product_id = i.product_id" +
    " left outer join inv.units u on p.unit_id = u.unit_id group by p.product_id order by p.product_id;";
  db.query(sql, (err, result) => {
    return res.json(result);
  });
};

const getProductNameCode = (req, res) => {
  const sql = "select product_id, name, code from inv.products";
  db.query(sql, (err, result) => {
    return res.json(result);
  });
};

const getProductNameCodeInv = (req, res) => {
  const sql =
    "select p.product_id, p.name, p.code from inv.inventories i left outer join inv.products p on i.product_id = p.product_id;";
  db.query(sql, (err, result) => {
    return res.json(result);
  });
};

const ProductInAllStores = (req, res) => {
  //console.log(req.body)
  const { product_id } = req.body;
  const sql =
    "select p.code,p.name,i.product_id, u.name as unit, i.unit_instock,i.min_stock,i.max_stock ,i.opening_balance, s.name as store from inv.inventories i left outer join inv.products p on " +
    "i.product_id = p.product_id left outer join inv.stores s on i.store_id = s.store_id left outer join inv.units u on p.unit_id = u.unit_id where i.product_id=?;";

  db.query(sql, [product_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    //console.log(result)
    console.log("Get Product Inventories in all stores");
    return res.status(200).json(result);
  });
};

const getProductById = (req, res) => {
  console.log(req.body);
  const { product_id } = req.body;
  const sql =
    "select p.*,u.name as unit, b.name as brand, c.name as category, i.image from inv.products p left outer join inv.units u on p.unit_id = u.unit_id " +
    "left outer join  inv.brands b on p.brand_id = b.brand_id " +
    "left outer join  inv.categories c on p.category_id = c.category_id left outer join inv.product_images i on p.product_id= i.product_id where p.product_id=?;";

  db.query(sql, [product_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    const productsWithImages = result.map((product) => {
      return {
        ...product,
        image: product.image ? product.image.toString("base64") : null,
        video: product.video ? product.video.toString("base64") : null,
      };
    });
    //console.log(result)
    // console.log(productsWithImages);
    return res.status(200).json(productsWithImages);
  });
};

const getProductVideoById = (req, res) => {
  console.log(req.body);
  const { product_id } = req.body;
  const sql = "select video from inv.products where product_id=?;";

  db.query(sql, [product_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    const productsWithVideo = result.map((product) => {
      return {
        ...product,
        video: product.video ? product.video.toString("base64") : null,
      };
    });
    //console.log(result)
    // console.log(productsWithVideo);
    return res.status(200).json(productsWithVideo);
  });
};

const getProductImagesById = (req, res) => {
  console.log(req.body);
  const { product_id } = req.body;
  const sql =
    "select *, ROW_NUMBER() OVER (ORDER BY product_id) AS image_ids from inv.product_images where product_id = ? order by product_id asc;";

  db.query(sql, [product_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    const productsWithImages = result.map((product) => {
      return {
        ...product,
        image: product.image ? product.image.toString("base64") : null,
      };
    });
    //console.log(result)
    console.log("Get Product Image detail by ID");
    return res.status(200).json(productsWithImages);
  });
};

const editProductImagesById = (req, res) => {
  console.log(req.body.image_id);
  console.log(req.file.buffer);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const product_image = req.file.buffer;
  const { image_id } = req.body;
  const sql = "update inv.product_images set image = ? where image_id = ?;";

  db.query(sql, [product_image, image_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Update Product" });
    }
    console.log("Product Image Updated successfully");
    return res
      .status(200)
      .json({ message: "Product Image Updated successfully" });
  });
};

const getProductByIdSale = (req, res) => {
  // console.log(req.body)
  const { product_id } = req.body;
  const sql =
    "select p.*,i.image from inv.products p left join inv.product_images i on p.product_id = i.product_id and i.image_id = (select min(k.image_id) from " +
    "inv.product_images k where k.product_id = i.product_id) where p.product_id = ?;";

  db.query(sql, [product_id], (err, result) => {
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
    console.log("Get Product for Sale by ID");
    return res.status(200).json(productsWithImage);
  });
};

const editProductApi = (req, res) => {
  const {
    product_id,
    code,
    name,
    details,
    unit_price,
    discount,
    unit_id,
    category_id,
    brand_id,
    display_product,
    active_product,
    flag,
  } = req.body;
  var m = null;
  if (req.file) {
    m = req.file.buffer;
    console.log(req.file.buffer);
  }
  const sql = "call inv.sp_edit_products(?,?,?,?,?,?,?,?,?,?,?,?,?);";
  db.query(
    sql,
    [
      product_id,
      code,
      name,
      details,
      unit_price,
      discount,
      unit_id,
      category_id,
      brand_id,
      display_product,
      active_product,
      m,
      flag,
    ],
    (err, result) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).json({ error: "Failed to Update Product" });
      }
      console.log("Product Updated successfully");
      return res.status(200).json({ message: "Product Updated successfully" });
    }
  );
};

const addProductImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const { product_id } = req.body;
  const product_image = req.file.buffer;

  const sql = "call inv.sp_add_product_images(?,?);";
  db.query(sql, [product_id, product_image], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Add Product Image" });
    }
    console.log("Product Image Added successfully");
    return res
      .status(200)
      .json({ message: "Product Image Added successfully" });
  });
};

const CheckProdNameCodeExist = (req, res) => {
  const sql =
    "select case when exists (select product_id from inv.products where name = ?) then 1 else 0 end as name," +
    "case when exists (select product_id from inv.products where code = ?) then 1 else 0 end as code;";
  const { name, code } = req.body;
  db.query(sql, [name, code], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to check Name exist" });
    }
    console.log(result);
    return res.status(200).json(result);
  });
};

const GetAllProductListSup = (req, res) => {
  const sql =
    "SELECT distinct p.product_id, p.code,p.name,p.details,p.active_product,p.display_product, p.discount,p.unit_price, " +
    "u.name as unit_id, c.name as category_id, b.name as brand_id,i.image FROM inv.products p left outer join inv.vendor_products v on p.product_id = v.product_id LEFT OUTER JOIN ( SELECT  " +
    "product_id,MIN(image_id) AS min_image_id FROM inv.product_images GROUP BY product_id ) min_images " +
    "ON p.product_id = min_images.product_id LEFT OUTER JOIN inv.product_images i ON min_images.product_id = i.product_id " +
    "AND min_images.min_image_id = i.image_id LEFT OUTER JOIN inv.units u ON p.unit_id = u.unit_id LEFT OUTER JOIN " +
    "inv.categories c ON p.category_id = c.category_id LEFT OUTER JOIN inv.brands b ON p.brand_id = b.brand_id where v.product_id is null " +
    "ORDER BY p.product_id asc LIMIT 5000;";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to Get Products" });
    }
    const productsWithImages = result.map((product) => {
      return {
        ...product,
        image: product.image ? product.image.toString("base64") : null,
      };
    });
    // console.log(productsWithImages)
    //res.send('Hello, World!');
    return res.json(productsWithImages);
  });
};

const GetOrderProductDetailById = (req, res) => {
  console.log(req.body);
  const sql =
    "SELECT distinct p.product_id,iv.unit_instock, v.name as vendor, p.code,p.name,p.details,p.active_product,p.display_product, p.discount,p.unit_price, " +
    "u.name as unit_id, c.name as category_id, b.name as brand_id,i.image " +
    "FROM inv.products p LEFT OUTER JOIN ( SELECT product_id,MIN(image_id) AS min_image_id FROM inv.product_images GROUP BY product_id ) min_images " +
    "ON p.product_id = min_images.product_id LEFT OUTER JOIN inv.product_images i ON min_images.product_id = i.product_id " +
    "AND min_images.min_image_id = i.image_id LEFT OUTER JOIN inv.units u ON p.unit_id = u.unit_id LEFT OUTER JOIN " +
    "inv.categories c ON p.category_id = c.category_id LEFT OUTER JOIN inv.brands b ON p.brand_id = b.brand_id " +
    "left outer join inv.vendor_products vp on vp.product_id = p.product_id " +
    "left outer join inv.vendors v on v.vendor_id = vp.vendor_id left outer join inv.inventories iv on iv.product_id = p.product_id " +
    "where p.product_id = ? and iv.store_id = ? ;";

  const { product_id, store_id } = req.body;
  db.query(sql, [product_id, store_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to get product" });
    }
    const productsWithImage = result.map((product) => {
      return {
        ...product,
        image: product.image ? product.image.toString("base64") : null,
      };
    });
    console.log("Get Product for Sale Order by ID");
    // console.log(productsWithImage);
    return res.status(200).json(productsWithImage);
  });
};

const GetAssignedProductDetailById = (req, res) => {
  console.log(req.body);
  const sql =
    "SELECT distinct p.product_id, p.code,p.name,p.details,p.active_product,p.display_product, p.discount,v.unit_price,v.delivery_days, " +
    " u.name as unit_id, c.name as category_id, b.name as brand_id,i.image FROM inv.products p left outer join inv.vendor_products v on p.product_id = v.product_id LEFT OUTER JOIN ( SELECT  " +
    "product_id,MIN(image_id) AS min_image_id FROM inv.product_images GROUP BY product_id ) min_images " +
    "ON p.product_id = min_images.product_id LEFT OUTER JOIN inv.product_images i ON min_images.product_id = i.product_id " +
    "AND min_images.min_image_id = i.image_id LEFT OUTER JOIN inv.units u ON p.unit_id = u.unit_id LEFT OUTER JOIN " +
    "inv.categories c ON p.category_id = c.category_id LEFT OUTER JOIN inv.brands b ON p.brand_id = b.brand_id where v.product_id is not null  and v.vendor_id = ? " +
    "ORDER BY p.product_id asc LIMIT 5000;";

  const { vendor_id } = req.body;
  db.query(sql, [vendor_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to get product Assign" });
    }
    const productsWithImage = result.map((product) => {
      return {
        ...product,
        image: product.image ? product.image.toString("base64") : null,
      };
    });
    console.log("Get Assigned Products by Vendor ID");
    // console.log(productsWithImage);
    return res.status(200).json(productsWithImage);
  });
};

const getProductsByFilter = (req, res) => {
  console.log(req.body);
  const sql = "call inv.sp_get_products_filter(?,?,?);";
  const { unit_id, brand_id, category_id } = req.body;
  db.query(sql, [unit_id, brand_id, category_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to get products" });
    }
    const productsWithImage1 = result[0];
    const productsWithImage = productsWithImage1.map((product) => {
      return {
        ...product,
        image: product.image ? product.image.toString("base64") : null,
      };
    });
    const productsWithImagew = productsWithImage1.map((product) => {
      return {
        image: product.product_id,
      };
    });
    console.log("Get Products By Filter");
    // console.log(productsWithImagew);
    return res.status(200).json(productsWithImage);
  });
};

const CheckProductBeforeDel = (req, res) => {
  // console.log(req.body);
  const sql =
    "SELECT s.product_id, CASE WHEN i.product_id IS NOT NULL THEN 1 ELSE 0 END AS inventory, CASE WHEN so.product_id IS NOT NULL THEN 1 ELSE 0 END AS sale, " +
    "CASE WHEN po.product_id IS NOT NULL THEN 1 ELSE 0 END AS purchase, CASE WHEN vp.product_id IS NOT NULL THEN 1 ELSE 0 END AS vendor FROM inv.products s LEFT JOIN inv.inventories i ON s.product_id = i.product_id " +
    "LEFT JOIN inv.sale_order_products so ON s.product_id = so.product_id LEFT JOIN inv.purchase_order_products po ON s.product_id = po.product_id left join vendor_products vp on s.product_id = vp.product_id  WHERE s.product_id = ?;";
  const { product_id } = req.body;
  db.query(sql, [product_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to check Product Del" });
    }
    console.log(result[0]);
    return res.status(200).json(result[0]);
  });
};

const DelProduct = (req, res) => {
  // console.log(req.body);
  const sql = "delete from inv.products where product_id = ?;";

  const { product_id } = req.body;
  db.query(sql, [product_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to Delete Product" });
    }
    console.log(result);
    return res.status(200).json(result);
  });
};

module.exports = {
  getProduct,
  addProduct,
  getProducts,
  getProductsByStoreId,
  getAllProductsInv,
  getProductNameCode,
  ProductInAllStores,
  getProductById,
  editProductApi,
  getProductNameCodeInv,
  getProductByIdSale,
  addProductImage,
  getProductImagesById,
  editProductImagesById,
  getProductVideoById,
  CheckProdNameCodeExist,
  GetAllProductListSup,
  GetOrderProductDetailById,
  getProductsByFilter,
  GetAssignedProductDetailById,
  CheckProductBeforeDel,
  DelProduct,
};
