const db = require("../connection/connection");

const getAllPurchaseByID = (req, res) => {
  console.log(req.body);
  const { store_id } = req.body;
  const sql =
    "select p.po_id, concat('P' , p.po_id ) as po, DATE_FORMAT(p.order_date, '%m/%d/%Y %l:%i:%s %p') as order_date, v.name as vendor, p.vendor_invoice_no, s.name as status, p.total, p.amount_paid as amt, p.amount_pending " +
    "from inv.purchase_orders p left outer join inv.vendors v on p.vendor_id = v.vendor_id left outer join inv.purchase_order_status s " +
    "on p.status_id = s.status_id left outer join inv.stores ss on p.store_id = ss.store_id where p.store_id = ? order by p.po_id desc limit 5000;";

  db.query(sql, [store_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get All Purchase By Store ID");
    // console.log(result)
    return res.status(200).json(result);
  });
};

const getAllPurchaseByVenID = (req, res) => {
  console.log(req.body);
  const { store_id, vendor_id } = req.body;
  const sql =
    "select p.po_id, concat('P' , p.po_id ) as po, DATE_FORMAT(p.order_date, '%m/%d/%Y %l:%i:%s %p') as order_date, v.name as vendor, p.vendor_invoice_no, s.name as status, p.total, p.amount_paid as amt, p.amount_pending " +
    "from inv.purchase_orders p left outer join inv.vendors v on p.vendor_id = v.vendor_id left outer join inv.purchase_order_status s " +
    "on p.status_id = s.status_id left outer join inv.stores ss on p.store_id = ss.store_id where p.store_id = ? and p.vendor_id = ? order by p.po_id desc limit 5000;";

  db.query(sql, [store_id, vendor_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get All Purchase By Vendor ID");
    // console.log(result)
    return res.status(200).json(result);
  });
};

const getProductsByStoreVendorId = (req, res) => {
  // console.log(req.body.store_id);
  const sql =
    "SELECT p.product_id, p.name as productname, p.code FROM inv.products p INNER JOIN inv.inventories i ON p.product_id=i.product_id left outer join inv.vendor_products vp " +
    " on vp.product_id=p.product_id WHERE i.store_id = ? and vp.vendor_id = ?";

  // Access store_id from headers
  const store_id = req.body.store_id;
  const vendor_id = req.body.vendor_id;
  console.log(vendor_id);
  db.query(sql, [store_id, vendor_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // console.log(result);
    return res.json(result);
  });
};

const addPurchaseOrder = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "CALL inv.sp_add_purchase_order(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Create Purchase Order" });
    }

    const flatData = result.flat();
    const customerObject = flatData.find((obj) => obj.po_id !== undefined);
    const po_id = customerObject ? customerObject.po_id : undefined;
    const results = {
      po_id: po_id,
    };
    console.log("Purchase order Created successfully");
    console.log(results);
    return res.status(200).json(results);
  });
};

const getPurchaseOrderDetailsByID = (req, res) => {
  const { po_id } = req.body;
  const sql =
    "select p.product_id,p.details, p.code, p.name as product_name, pop.unit_price, pi.image, COALESCE(pop.quantity,0) as quantity, pop.discount, COALESCE(ss.product_received,0) as product_received " +
    "from inv.purchase_orders po left outer join inv.purchase_order_products pop on po.po_id = pop.po_id " +
    "left outer join inv.products p on pop.product_id = p.product_id " +
    "left outer join (select distinct sum(quantity_recv) as product_received, product_id,po_id from inv.receive_log group by " +
    "product_id, po_id) as ss on ss.product_id = pop.product_id and ss.po_id = pop.po_id " +
    "left outer join inv.product_images pi on pop.product_id = pi.product_id " +
    "where (pi.image_id = (select min(k.image_id) from inv.product_images k where k.product_id = pop.product_id and pop.product_id is not null) or pi.image_id is null) and po.po_id = ? ;";

  db.query(sql, [po_id], (err, result) => {
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
    console.log("Get Purchase Order Details by ID");
    console.log(result);
    return res.status(200).json(productsWithImages);
  });
};

const getPurchaseOrderVendorByID = (req, res) => {
  const { po_id } = req.body;
  const sql =
    "select  v.vendor_id,(select case when exists (select po_id from inv.special_order_products where po_id = ?) then 1 else 0 end as po_id) as po_id , v.name,p.amount_paid,a.account_id, COALESCE(p.vendor_invoice_no) as vendor_invoice_no,p.status_id, COALESCE(pop.recv_by,'') as recv_by,p.store_id, COALESCE(p.ship_method,'') as ship_method, COALESCE(p.tracking_no,'') as tracking_no, p.po_note from " +
    "inv.purchase_orders p left outer join inv.vendors v on p.vendor_id = v.vendor_id left outer join inv.accounts a on a.account_id = v.account_id " +
    "left outer join inv.purchase_order_products pp on p.po_id= pp.po_id left outer join inv.receive_log pop on pp.product_id = pop.product_id and pop.po_id = p.po_id where p.po_id= ? limit 1;";
  db.query(sql, [po_id, po_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Purchase Order Vendor Details by ID");
    console.log(result);
    return res.status(200).json(result);
  });
};

const EditPurchaseOrder = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "CALL inv.sp_edit_purchase_order(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Update Purchase Order" });
    }
    console.log("Purchase order Updated successfully");
    return res
      .status(200)
      .json({ message: "Purchase order Updated successfully" });
  });
};

const deleteEditPurchaseOrderProduct = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  // console.log(jsonData);
  const sql = "CALL inv.sp_delete_purchase_order_edit_product(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to Delete product from Edit Purchase Order" });
    }
    console.log("Product deleted from Purchase order successfully");
    return res
      .status(200)
      .json({ message: "Product deleted from Purchase order successfully" });
  });
};

const getReceiveProductsByPO_ID = (req, res) => {
  const { po_id, store_id } = req.body;
  // console.log(so_id)
  const sql =
    "select distinct p.code, p.product_id, p.code, p.name as product, COALESCE(pop.quantity,0) as total_qty, p.details, " +
    "COALESCE(tt.qty_recv, 0) as qty_recv, COALESCE(ss.qty_reject,0) as qty_reject, COALESCE(rr.lst_qty_recv,0) as last_qty_recv, " +
    "COALESCE(zz.lst_qty_rej, 0) as last_qty_reject " +
    "from inv.purchase_order_products pop left outer join inv.receive_log r on pop.product_id = r.product_id and " +
    "pop.po_id = r.po_id left outer join inv.products p on pop.product_id = p.product_id left outer join (select distinct " +
    "sum(quantity_recv) as qty_recv, product_id, po_id from inv.receive_log group by product_id, po_id) as tt " +
    "on r.product_id = tt.product_id and r.po_id = tt.po_id left outer join (select distinct " +
    "sum(quantity_reject) as qty_reject, product_id, po_id from inv.receive_log group by product_id, po_id) " +
    "as ss on r.product_id = ss.product_id and r.po_id = ss.po_id left outer join (select quantity_recv as lst_qty_recv, product_id, po_id " +
    "from inv.receive_log where log_id = (select max(log_id) from inv.receive_log)) as rr on r.product_id = rr.product_id and r.po_id = rr.po_id " +
    "left outer join (select quantity_reject as lst_qty_rej, product_id, po_id " +
    "from inv.receive_log where log_id = (select max(log_id) from inv.receive_log)) as zz on r.product_id = zz.product_id and r.po_id = zz.po_id " +
    "left outer join inv.inventories i on i.product_id = pop.product_id where pop.po_id = ? and i.store_id = ? ;";

  db.query(sql, [po_id, store_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Receive Log Products By PO ID");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const getReceiveLogPurchaseOrderByID = (req, res) => {
  const { po_id, store_id } = req.body;
  // console.log(so_id)
  const sql =
    "select p.po_id,DATE_FORMAT(p.order_date, '%m/%d/%Y %l:%i:%s %p') as order_date, p.vendor_invoice_no, u.username, u.user_id, v.name as vendor from " +
    "inv.purchase_orders p left outer join inv.users u on p.user_id = u.user_id  left outer join " +
    "inv.vendors v on p.vendor_id = v.vendor_id where p.po_id = ? and p.store_id = ? ;";

  db.query(sql, [po_id, store_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Purchase Order Receive By ID Details");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const EditReceive_Log = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "call inv.sp_edit_receive_log_Products(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to Update Receive Log Products" });
    }
    console.log("Receive Log Updated successfully");
    return res
      .status(200)
      .json({ message: "Receive Log Updated successfully" });
  });
};

const getPurchaseOrderDetailRecByID = (req, res) => {
  const { po_id } = req.body;
  // console.log(so_id)
  const sql =
    "select distinct p.product_id, p.name as product, p.code,COALESCE(pop.discount,0) as discount, COALESCE(pop.unit_price,0) as unit_price, COALESCE(tt.qty_recv,0) as qty_recv, " +
    "COALESCE(tt.qty_rej,0) as qty_rej, p.details, COALESCE(pop.quantity,0) as quantity, COALESCE(((pop.unit_price * pop.quantity) - pop.discount),0) " +
    "as total from inv.purchase_order_products pop left outer join inv.products p on pop.product_id=p.product_id " +
    "left outer join inv.receive_log r on pop.product_id=r.product_id and pop.po_id=r.po_id " +
    "left outer join (select distinct sum(quantity_recv) as qty_recv, sum(quantity_reject) as qty_rej, product_id,po_id " +
    "from inv.receive_log group by product_id, po_id) as tt on tt.product_id = pop.product_id and tt.po_id = pop.po_id " +
    "where pop.po_id = ? ;";

  db.query(sql, [po_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Purchase Order Receive Details");
    console.log(result);
    return res.status(200).json(result);
  });
};

const getPurchaseOrderDetail = (req, res) => {
  const { po_id } = req.body;
  // console.log(so_id)
  const sql =
    "select s.vendor_id, concat('P', s.po_id) as po_id, c.name as vendor, s.vendor_invoice_no, s.ship_method, s.tracking_no, COALESCE(s.total,0) as total, " +
    "COALESCE(s.amount_paid,0) as amount_paid, COALESCE(s.amount_pending,0) as amount_pending, ss.name as status,u.username as user, " +
    "s.po_note from inv.purchase_orders s left outer join inv.vendors c on s.vendor_id = c.vendor_id left outer join inv.users u " +
    "on s.user_id = u.user_id left outer join inv.purchase_order_status ss on s.status_id = ss.status_id where s.po_id = ? ;";

  db.query(sql, [po_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Purchase Order Detail");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const EditPurchaseStatusBYPo_id = (req, res) => {
  const { po_id, status_id } = req.body;
  // console.log(jsonData);
  const sql = "update inv.purchase_orders set status_id = ? where po_id = ?";

  db.query(sql, [status_id, po_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to Update Receive Products status" });
    }

    console.log("Purchase Order Status Updated successfully");
    console.log(result);
    return res.status(200).json(result);
  });
};

const GetAccToIdByPusOrder = (req, res) => {
  const { po_id } = req.body;
  console.log(po_id);
  const sql =
    // "select a.name, l.end_balance from inv.purchase_orders s left outer join inv.order_payments o on s.po_id = o.po_id left outer join inv.payments p on " +
    // "o.payment_id = p.payment_id left outer join inv.accounts a on a.account_id = p.acc_from_id " +
    // "left outer join inv.accounts b on b.account_id = p.acc_to_id left outer join inv.ledgers l on " +
    // " l.account_id = b.account_id where s.po_id = ? and l.ledger_id=(select max(k.ledger_id) from inv.ledgers k where k.account_id = b.account_id);";

    "call inv.sp_get_Acc_To_Id_By_PusOrder(?);";

  db.query(sql, [po_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Create Estimation" });
    }
    console.log("Get Account ID BY Sale Order ID");
    console.log(result);
    return res.status(200).json(result[0]);
  });
};

const GetReceiveLogDetailByid = (req, res) => {
  const { po_id } = req.body;
  console.log(po_id);
  const sql =
    "select l.log_id, l.quantity,l.product_id,pp.code, coalesce(l.quantity_recv,0) as qty_recv,pp.details, coalesce(l.quantity_reject,0) as qty_rej, coalesce(l.recv_by,'') as rcv_by, " +
    "coalesce(date(l.recv_date), '') as rcv_date, coalesce(date(l.mfg_date), '') as mfg_date, l.note as note " +
    ", coalesce((select sum(v.quantity_recv) from inv.receive_log v where v.product_id = a.product_id and v.po_id = p.po_id and " +
    "v.log_id <= l.log_id group by v.product_id)) as running_qty_rcv, coalesce((select sum(v.quantity_reject) from inv.receive_log v where " +
    "v.product_id = a.product_id and v.po_id = p.po_id and v.log_id <= l.log_id group by v.product_id) , 0) as running_qty_rej " +
    "from inv.receive_log l inner join inv.purchase_orders p on p.po_id = l.po_id  inner join " +
    "inv.purchase_order_products a on a.po_id = p.po_id and a.product_id = l.product_id inner join inv.products pp on pp.product_id = l.product_id where p.po_id = ? order by l.product_id, l.log_id asc;";

  db.query(sql, [po_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to get receive log details." });
    }
    console.log("Get Receive Log Details By po_id.");
    console.log(result);
    return res.status(200).json(result);
  });
};

const GetSpecialOrderProdDetail = (req, res) => {
  const { store_id, vendor_id } = req.body;
  console.log(req.body);
  const sql =
    "SELECT i.unit_instock, i.opening_balance, p.code,p.discount,p.cost_price, p.name AS productname,pi.image, p.details, p.product_id, u.name AS unit, p.unit_price, " +
    "if((COALESCE(SUM(sp.quantity), 0) - COALESCE(SUM(sh.quantity_shipped), 0)) - COALESCE(i.unit_instock, 0) > 0, " +
    "(COALESCE(SUM(sp.quantity), 0) - COALESCE(SUM(sh.quantity_shipped), 0)) - COALESCE(i.unit_instock, 0), 0) as quantity " +
    "FROM inv.stores s LEFT JOIN inv.inventories i ON s.store_id = i.store_id LEFT JOIN inv.products p ON i.product_id = p.product_id LEFT JOIN inv.units u ON p.unit_id = u.unit_id " +
    "left JOIN inv.product_images pi ON p.product_id = pi.product_id left join inv.sale_order_products sp on p.product_id = sp.product_id " +
    "inner join inv.sale_orders so ON sp.so_id = so.so_id AND so.status_id = 80 and so.store_id = ? left outer join inv.shipments sh ON sh.product_id = sp.product_id  " +
    "AND sh.so_id = sp.so_id inner join (select i.product_id,i.store_id, i.unit_instock as unit_instock from inv.inventories i) as ii on ii.product_id = sp.product_id " +
    "and ii.store_id = s.store_id left outer join inv.vendor_products v on sp.product_id = v.product_id inner join inv.vendors vp " +
    "on v.vendor_id = vp.vendor_id and v.vendor_id = ? WHERE s.store_id = ? and (pi.image_id = (SELECT MIN(k.image_id) FROM inv.product_images k " +
    "WHERE (k.product_id = i.product_id and i.product_id is not null )) or pi.image_id is null) group by sp.product_id, v.vendor_id,pi.image having quantity > 0;";

  db.query(sql, [store_id, vendor_id, store_id], (err, result) => {
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
    console.log("Get Purchase Order Details by ID");
    // console.log(result)
    return res.status(200).json(productsWithImages);
  });
};

module.exports = {
  getAllPurchaseByID,
  getProductsByStoreVendorId,
  addPurchaseOrder,
  getPurchaseOrderDetailsByID,
  getPurchaseOrderVendorByID,
  EditPurchaseOrder,
  deleteEditPurchaseOrderProduct,
  getReceiveProductsByPO_ID,
  getReceiveLogPurchaseOrderByID,
  EditReceive_Log,
  getPurchaseOrderDetailRecByID,
  getPurchaseOrderDetail,
  EditPurchaseStatusBYPo_id,
  GetAccToIdByPusOrder,
  GetReceiveLogDetailByid,
  GetSpecialOrderProdDetail,
  getAllPurchaseByVenID,
};
