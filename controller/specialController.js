const db = require("../connection/connection");

const AddSpecialOrder = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "call inv.add_special_order_product(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to add special order product." });
    }
    console.log("Successfully added special order products.");
    console.log(result);

    const flatData = result.flat();
    const customerObject = flatData.find((obj) => obj.idss !== undefined);
    const id = customerObject ? customerObject.idss : undefined;
    const results = {
      id: id,
    };
    console.log(result);
    return res.status(200).json(results);
  });
};

const EditSpecialOrder = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "call inv.edit_special_order_product(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to edit special order product." });
    }
    console.log("Successfully update special order products.");
    console.log(result);

    const flatData = result.flat();
    const customerObject = flatData.find((obj) => obj.idss !== undefined);
    const id = customerObject ? customerObject.idss : undefined;
    const results = {
      id: id,
    };
    console.log(result);
    return res.status(200).json(results);
  });
};

const GetSpecialOrderDetail = (req, res) => {
  // console.log(req.body);
  const sql = "call inv.sp_get_special_order_products_filter(?,?);";

  const { store_id, vendor_id } = req.body;
  db.query(sql, [store_id, vendor_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res
        .status(500)
        .json({ error: "Failed to Get Special order Detail" });
    }
    // console.log(result);
    return res.status(200).json(result[0]);
  });
};

const GetSpecialOrderProdByStoreID = (req, res) => {
  const { store_id, vendor_id } = req.body;
  console.log(req.body);
  const sql =
    "select sps.product_id,p.code, COALESCE(sum(sps.quantity_req)-sum(sps.quantity_order),0) as quantity,p.discount, s.store_id, pi.image,v.vendor_id, v.name as vendor, " +
    "p.details, p.name as productname, COALESCE(p.unit_price,0) as unit_price, COALESCE(p.cost_price,0) as cost_price from inv.special_order_products sps left outer join inv.sale_orders s on " +
    "sps.so_id = s.so_id left outer join inv.products p on sps.product_id = p.product_id left outer join inv.product_images pi on p.product_id = pi.product_id " +
    "left outer join inv.vendor_products vp on sps.product_id = vp.product_id left outer join inv.vendors v on vp.vendor_id = v.vendor_id " +
    "where s.store_id = ? and v.vendor_id = ? and sps.quantity_req > 0 and (pi.image_id = (select min(k.image_id) from inv.product_images k " +
    "where (k.product_id = p.product_id and p.product_id is not null)) or pi.image_id is null) group by sps.product_id,pi.image,v.vendor_id;";

  db.query(sql, [store_id, vendor_id], (err, result) => {
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
    console.log("Get Special Order Product by Store ID");
    // console.log(result)
    return res.status(200).json(productsWithImages);
  });
};

const GetVendorList = (req, res) => {
  const sql =
    "select v.name as vendor , v.vendor_id from inv.vendors v inner join inv.accounts a on a.account_id = v.account_id;";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Vendor List.");
    return res.status(200).json(result);
  });
};

const EditSpecialOrderPurchase = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "CALL inv.sp_edit_special_order_products(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to Update Special Order Purchase" });
    }
    console.log("Special Order Purchase updated successfully");
    console.log(result);
    var a = result[0];
    return res.status(200).json(a);
  });
};

module.exports = {
  AddSpecialOrder,
  EditSpecialOrder,
  GetSpecialOrderDetail,
  GetSpecialOrderProdByStoreID,
  GetVendorList,
  EditSpecialOrderPurchase,
};
