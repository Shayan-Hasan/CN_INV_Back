const db = require("../connection/connection");

const getAllSalesByID = (req, res) => {
  console.log(req.body);
  const { store_id, est_sale } = req.body;
  const sql =
    "select distinct SO.so_id,coalesce(concat(SO.est_sale, SO.so_id), '-') as 'Q-S #',SO.project_name as Proj, DATE_FORMAT(SO.est_date, '%m/%d/%Y %l:%i:%s %p') as 'Quote Date', SO.customer_po_no as 'Customer PO', s.name as 'Status'," +
    "DATE_FORMAT(SO.sale_date, '%m/%d/%Y %l:%i:%s %p') as 'Sale Date', c.name as 'Customer', COALESCE(SO.total,0) as total,COALESCE(SO.amount_paid,0) as amt, COALESCE(SO.amount_pending,0) as amount_pending from inv.sale_orders SO left outer join inv.customers c" +
    " on SO.customer_id = c.customer_id left outer join inv.sale_order_status s on SO.status_id = s.status_id left outer join inv.sale_order_products sop on SO.so_id=sop.so_id " +
    "left outer join inv.inventories i on i.product_id=sop.product_id and i.store_id=SO.store_id " +
    "where SO.store_id = ? and SO.est_sale = ? order by SO.so_id desc;";
  db.query(sql, [store_id, est_sale], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get All Sales By Store ID");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const getAllSalesByCusID = (req, res) => {
  console.log(req.body);
  const { store_id, est_sale, customer_id } = req.body;
  const sql =
    "select distinct SO.so_id,coalesce(concat(SO.est_sale, SO.so_id), '-') as 'Q-S #',SO.project_name as Proj, DATE_FORMAT(SO.est_date, '%m/%d/%Y %l:%i:%s %p') as 'Quote Date', SO.customer_po_no as 'Customer PO', s.name as 'Status'," +
    "DATE_FORMAT(SO.sale_date, '%m/%d/%Y %l:%i:%s %p') as 'Sale Date', c.name as 'Customer', COALESCE(SO.total,0) as total,COALESCE(SO.amount_paid,0) as amt, COALESCE(SO.amount_pending,0) as amount_pending from inv.sale_orders SO left outer join inv.customers c" +
    " on SO.customer_id = c.customer_id left outer join inv.sale_order_status s on SO.status_id = s.status_id left outer join inv.sale_order_products sop on SO.so_id=sop.so_id " +
    "left outer join inv.inventories i on i.product_id=sop.product_id and i.store_id=SO.store_id " +
    "where SO.store_id = ? and SO.est_sale = ? and SO.customer_id = ? order by SO.so_id desc;";
  db.query(sql, [store_id, est_sale, customer_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get All Sales By Customer ID");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const getSaleOrderDetailsByID = (req, res) => {
  const { so_id } = req.body;
  const sql =
    "select p.product_id, p.code, p.name as product_name, sop.price as unit_price,pi.image,p.details, COALESCE(sps.quantity_req,0) as quantity_req, COALESCE(sop.quantity,0) as quantity,sop.req_delivery_date, sop.discount, COALESCE(ss.product_shipped,0) as product_shipped " +
    "from inv.sale_orders so left outer join inv.sale_order_products sop on so.so_id = sop.so_id " +
    "left outer join inv.products p on sop.product_id = p.product_id " +
    "left outer join (select distinct sum(quantity_shipped) as product_shipped, product_id,so_id from inv.shipments group by  " +
    "product_id, so_id) as ss on ss.product_id = sop.product_id and ss.so_id = sop.so_id " +
    "left outer join inv.special_order_products sps on sop.so_id = sps.so_id and sop.product_id = sps.product_id " +
    "left outer join inv.product_images pi on sop.product_id = pi.product_id " +
    "where so.so_id = ? and (pi.image_id = (select min(k.image_id) from inv.product_images k where k.product_id = sop.product_id and sop.product_id is not null) or pi.image_id is null);";
  db.query(sql, [so_id], (err, result) => {
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
    console.log("Get Sale Order Details by ID");
    console.log(result);
    return res.status(200).json(productsWithImages);
  });
};

const getSaleOrderCustomerByID = (req, res) => {
  const { so_id } = req.body;
  const sql =
    "select c.customer_id,a.account_id,(select case when exists (select so_id from inv.special_order_products where so_id = ? and po_id is not null ) then 1 else 0 end as po_id) as po_id, c.name, s.customer_po_no, s.project_name, s.store_id,s.status_id,COALESCE(s.amount_paid,0) as amount_paid, s.ship_method, s.tracking_no,COALESCE(i.shipment,0) as shipment, COALESCE(i.tax,0) as tax,s.so_note, " +
    "i.invoice_id from inv.sale_orders s left outer join inv.customers c on s.customer_id = c.customer_id left outer join inv.invoices i on s.so_id = i.so_id " +
    "left outer join inv.accounts a on a.account_id = c.account_id where s.so_id = ?;";
  db.query(sql, [so_id, so_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Sale Order Customer Details by ID");
    console.log(result);
    return res.status(200).json(result);
  });
};

const getSaleCusBalByID = (req, res) => {
  const { customer_id } = req.body;
  const sql =
    "select l.end_balance, c.name, c.customer_id, c.account_id from inv.customers c left outer join inv.ledgers l " +
    "on c.account_id = l.account_id where l.ledger_id = (select max(k.ledger_id) from inv.ledgers k where k.account_id = c.account_id) and c.customer_id = ?;";
  db.query(sql, [customer_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Bal by Cus ID");
    // console.log(result)
    return res.status(200).json(result);
  });
};

const getCustomerByID = (req, res) => {
  const { customer_id } = req.body;
  // console.log(customer_id)
  const sql =
    "select customer_id, name, phone, contact_phone, contact_email from inv.customers where customer_id = ?;";
  db.query(sql, [customer_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Customer Details by ID");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const addSaleOrder = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "CALL inv.sp_add_sale_order(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Create Sale Order" });
    }
    console.log("Sale order Created successfully");
    // console.log(result);
    const flatData = result.flat();
    const customerObject = flatData.find((obj) => obj.so_id !== undefined);
    const so_id = customerObject ? customerObject.so_id : undefined;
    const results = {
      so_id: so_id,
    };
    return res.status(200).json(results);
  });
};

const deleteEditSaleOrderProduct = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "CALL inv.sp_delete_sale_order_edit_product(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to Delete product from Edit Sale Order" });
    }
    console.log("Product deleted from Sale order successfully");
    return res
      .status(200)
      .json({ message: "Product deleted from Sale order successfully" });
  });
};

const EditSaleOrder = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "CALL inv.sp_edit_sale_order(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Update Sale Order" });
    }
    console.log("Sale order Updated successfully");
    return res.status(200).json({ message: "Sale order Updated successfully" });
  });
};

const ConvertEst = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "CALL inv.sp_convert_estimate(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Convert Estimate" });
    }
    console.log("Estimate Convert successfully");
    return res.status(200).json({ message: "Estimate Convert successfully" });
  });
};

const EditEstimation = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "CALL inv.sp_edit_estimation(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Update Estimation" });
    }
    console.log("Estimation Updated successfully");
    return res.status(200).json({ message: "Estimation Updated successfully" });
  });
};

const RemoveProd_fromShipmentTrans = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "CALL inv.sp_edit_removeProductfrom_shippment_transaction(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({
        error: "Failed to Remove product from shipment in Sale Order",
      });
    }
    console.log(
      "Unshipped product remove from Sale order Updated successfully"
    );
    return res.status(200).json({
      message: "Unshipped product remove from Sale order Updated successfully",
    });
  });
};

const getSaleOrderDetail = (req, res) => {
  const { so_id } = req.body;
  // console.log(so_id)
  const sql =
    "select s.so_id,s.customer_id, c.name as customer, s.customer_po_no, s.project_name, s.ship_method, s.tracking_no, i.total_price, s.amount_paid, " +
    "s.amount_pending, ss.name as status,u.username as user,s.so_note, i.tax, i.shipment from inv.sale_orders s left outer join inv.customers c " +
    "on s.customer_id = c.customer_id left outer join inv.users u on s.user_id = u.user_id left outer join inv.invoices i " +
    "on s.so_id = i.so_id left outer join inv.sale_order_status ss on s.status_id = ss.status_id where s.so_id = ? ;";

  db.query(sql, [so_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Sale Order Detail");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const getSaleOrderDetailShipmentByID = (req, res) => {
  const { so_id } = req.body;
  // console.log(so_id)
  const sql =
    "select distinct p.product_id, p.name as product,p.code,COALESCE(sop.discount,0) as discount, COALESCE(sop.price,0) as unit_price, COALESCE(sop.quantity,0) as quantity, COALESCE(sop.price,0) as price, " +
    "COALESCE(tt.qty_ship ,0) as quantity_shipped,(COALESCE(sop.price,0) * COALESCE(sop.quantity,0) - COALESCE(sop.discount,0)) as total, (sop.price * sop.quantity) as e_total from inv.sale_order_products sop left outer join inv.products p " +
    "on sop.product_id=p.product_id left outer join " +
    "(select distinct sum(quantity_shipped) as qty_ship, product_id,so_id from inv.shipments group by " +
    "product_id, so_id) as tt on tt.product_id = sop.product_id and tt.so_id = sop.so_id where sop.so_id = ? ;";

  db.query(sql, [so_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Sale Order Shipment Details");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const getShipmentSaleOrderByID = (req, res) => {
  const { so_id } = req.body;
  // console.log(so_id)
  const sql =
    "select s.so_id,DATE_FORMAT(s.sale_date, '%m/%d/%Y %l:%i:%s %p') as sale_date, c.name as customer, i.invoice_id from inv.sale_orders s left outer join " +
    "inv.customers c on s.customer_id=c.customer_id left outer join inv.invoices i on s.so_id=i.so_id where " +
    "s.so_id = ? ;";

  db.query(sql, [so_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Sale Order ShipmentProduct By ID Details");
    // console.log(result);
    return res.status(200).json(result);
  });
};

const getShipmentProductsBySO_ID = (req, res) => {
  const { so_id, store_id } = req.body;
  console.log(req.body);
  const sql =
    "select distinct p.product_id, p.code, p.name as product, COALESCE(sop.quantity,0) as total_qty, p.details, COALESCE(tt.qty_ship,0) as quantity_shipped, " +
    "COALESCE(ss.lst,0) as last_qty from inv.sale_order_products sop left outer join inv.shipments sh on sop.product_id=sh.product_id and " +
    "sop.so_id = sh.so_id left outer join inv.products p on p.product_id = sop.product_id left outer join inv.inventories i on " +
    "i.product_id = p.product_id left outer join (select distinct sum(quantity_shipped) as qty_ship, product_id,so_id from inv.shipments group by " +
    "product_id, so_id) as tt on tt.product_id = sh.product_id and tt.so_id = sh.so_id left outer join (select quantity_shipped as lst, product_id, so_id " +
    "from inv.shipments where shipment_id = (select max(shipment_id) from inv.shipments)) as ss " +
    "on ss.product_id = sh.product_id and ss.so_id = sh.so_id where sop.so_id = ? and i.store_id = ? ;";

  db.query(sql, [so_id, store_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Shipment Products By SO ID");
    console.log(result);
    return res.status(200).json(result);
  });
};

const EditShipment = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  const sql = "call inv.sp_edit_shipment_Products(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to Update Shipment Products" });
    }
    console.log("Shipment Updated successfully");
    return res.status(200).json({ message: "Shipment Updated successfully" });
  });
};

const EditSaleOrderStatus = (req, res) => {
  const { so_id } = req.body;
  // console.log(jsonData);
  const sql = "call inv.update_sale_order_statue(?);";

  db.query(sql, [so_id, so_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to Update Shipment Products" });
    }

    console.log("Sale Order Status Updated successfully");
    console.log(result);
    return res.status(200).json(result);
  });
};

const EditSaleOrderStatusBYSo_id = (req, res) => {
  const { so_id, status_id } = req.body;
  // console.log(jsonData);
  const sql = "update inv.sale_orders set status_id = ? where so_id = ?";

  db.query(sql, [status_id, so_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to Update Shipment Products" });
    }

    console.log("Sale Order Status Updated successfully");
    console.log(result);
    return res.status(200).json(result);
  });
};

const addEstimation = (req, res) => {
  const jsonData = JSON.stringify(req.body);
  console.log(jsonData);
  const sql = "CALL inv.sp_add_estimation(?);";
  db.query(sql, [jsonData], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Create Estimation" });
    }
    console.log("Estimation Creation successfully");
    console.log(result);
    var a = result[0];
    return res.status(200).json(a);
  });
};

const GetAccToIdBySaleOrder = (req, res) => {
  const { so_id } = req.body;
  console.log(so_id);
  const sql =
    // "select a.name, l.end_balance from inv.sale_orders s left outer join inv.order_payments o on s.so_id = o.so_id left outer join inv.payments p on " +
    // "o.payment_id = p.payment_id left outer join inv.accounts a on a.account_id = p.acc_to_id " +
    // "left outer join inv.accounts b on b.account_id = p.acc_from_id left outer join inv.ledgers l on " +
    // "l.account_id = b.account_id where s.so_id = ? and l.ledger_id=(select max(k.ledger_id) from inv.ledgers k where k.account_id = b.account_id);";

    "call inv.sp_get_Acc_To_Id_By_SaleOrder(?);";

  db.query(sql, [so_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Create Estimation" });
    }
    console.log("Get Account ID BY Sale Order ID");
    console.log(result);
    return res.status(200).json(result[0]);
  });
};

const GetAccToIdBySaleOrder1 = (req, res) => {
  const { so_id } = req.body;
  console.log(so_id);
  const sql =
    "select s.customer_id, c.name, l.end_balance from inv.sale_orders s left outer join inv.customers c on c.customer_id = s.customer_id " +
    "left outer join inv.ledgers l on c.account_id = l.account_id " +
    "where l.ledger_id = (select max(k.ledger_id) from inv.ledgers k where k.account_id = c.account_id) and s.so_id = ?;";

  db.query(sql, [so_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to Create Estimation" });
    }
    console.log("Get Account ID BY Sale Order ID");
    console.log(result);
    return res.status(200).json(result);
  });
};

const GetShipmentDetailByid = (req, res) => {
  const { so_id } = req.body;
  console.log(so_id);
  const sql =
    "select sp.shipment_id, sp.quantity, sp.product_id,pp.details,pp.code, coalesce(sp.quantity_shipped,0) as qty_ship, coalesce(date(sp.date_shipped),'') as date_shipped,sp.ship_address, sp.note, " +
    "coalesce((select sum(v.quantity_shipped) from inv.shipments v where v.product_id = p.product_id and v.so_id = p.so_id and v.shipment_id <= sp.shipment_id " +
    "group by v.product_id)) as running_qty_ship from inv.shipments sp inner join inv.sale_orders s on sp.so_id = s.so_id " +
    "inner join inv.sale_order_products p on p.so_id = s.so_id and p.product_id = sp.product_id inner join inv.products pp on pp.product_id = sp.product_id where " +
    "s.so_id = ? order by sp.product_id, sp.shipment_id asc;";

  db.query(sql, [so_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res
        .status(500)
        .json({ error: "Failed to get shipement details." });
    }
    console.log("Get shipment Details By so_id.");
    console.log(result);
    return res.status(200).json(result);
  });
};

const GetTaxByStoreId = (req, res) => {
  const { store_id } = req.body;
  // console.log(store_id);
  const sql = "select * from inv.stores where store_id = ?;";

  db.query(sql, [store_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to get store details." });
    }
    console.log("Get store Details By store_id.");
    console.log(result);
    return res.status(200).json(result);
  });
};

module.exports = {
  getAllSalesByID,
  getCustomerByID,
  addSaleOrder,
  getSaleOrderDetailsByID,
  getSaleOrderCustomerByID,
  deleteEditSaleOrderProduct,
  EditSaleOrder,
  RemoveProd_fromShipmentTrans,
  getSaleOrderDetailShipmentByID,
  getSaleOrderDetail,
  getShipmentSaleOrderByID,
  getShipmentProductsBySO_ID,
  EditShipment,
  EditSaleOrderStatus,
  addEstimation,
  EditSaleOrderStatusBYSo_id,
  EditEstimation,
  GetAccToIdBySaleOrder,
  ConvertEst,
  getSaleCusBalByID,
  GetAccToIdBySaleOrder1,
  GetShipmentDetailByid,
  GetTaxByStoreId,
  getAllSalesByCusID,
};
