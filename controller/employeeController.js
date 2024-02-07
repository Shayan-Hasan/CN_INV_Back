const db = require("../connection/connection");

const addEmployee = (req, res) => {
  console.log(req.body);
  const {
    name,
    email,
    contact,
    hire_date,
    manager_id,
    salary,
    store_id,
    street_address,
    city,
    state,
    postal_code,
    acc_type_id,
    acc_notes,
    opening_balance,
  } = req.body;
  const sql = "call inv.add_employee(?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
  db.query(
    sql,
    [
      name,
      email,
      contact,
      hire_date,
      manager_id,
      salary,
      store_id,
      street_address,
      city,
      state,
      postal_code,
      acc_type_id,
      acc_notes,
      opening_balance,
    ],
    (err, result) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).json({ error: "Failed to Add Employee" });
      }
      console.log("Employee Added successfully");
      return res.status(200).json({ message: "Employee Added successfully" });
    }
  );
};

const editEmployee = (req, res) => {
  console.log(req.body);
  const {
    employee_id,
    name,
    email,
    contact,
    hire_date,
    manager_id,
    salary,
    location_id,
    store_id,
    street_address,
    city,
    state,
    postal_code,
    account_id,
    acc_type_id,
    acc_notes,
    opening_balance,
    ledger_type_id,
  } = req.body;
  const sql = "call inv.edit_employee(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
  db.query(
    sql,
    [
      employee_id,
      name,
      email,
      contact,
      hire_date,
      manager_id,
      salary,
      location_id,
      store_id,
      street_address,
      city,
      state,
      postal_code,
      account_id,
      acc_type_id,
      acc_notes,
      opening_balance,
      ledger_type_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).json({ error: "Failed to Update Employee" });
      }
      console.log("Employee Updated successfully");
      return res.status(200).json({ message: "Employee Updated successfully" });
    }
  );
};

const getEmployeeByID = (req, res) => {
  //const { employee_id } = req.headers;
  console.log(req.body.employee_id);
  const sql = "call inv.sp_get_employees_filter(?,null);";
  db.query(sql, [req.body.employee_id], (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get Employee Details by ID ok");
    console.log(result);
    return res.status(200).json(result);
  });
};

const getAllEmployees = (req, res) => {
  const sql =
    "SELECT e.*, l.*, s.name as store, m.end_balance as balance, if(e.manager_id is not null , em.name, null) as Manager FROM inv.employees e " +
    "left join inv.locations l on e.location_id = l.location_id " +
    "left join inv.employees em on e.manager_id = em.employee_id " +
    "left join inv.ledgers m on m.account_id = e.account_id " +
    "left join inv.ledgers v on v.account_id = e.account_id " +
    "left join inv.stores s on e.store_id = s.store_id where " +
    "m.ledger_id = (select max(k.ledger_id) from inv.ledgers k where k.account_id = e.account_id) and v.type_id =900 " +
    "order by e.employee_id desc limit 5000;";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get All Employee Details");
    console.log(result);
    return res.status(200).json(result);
  });
};

const getAllManagers = (req, res) => {
  const sql = "select employee_id, name as manager from inv.employees;";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Database insertion error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    console.log("Get All Employee Manager");
    // console.log(result)
    return res.status(200).json(result);
  });
};

const getAllManagersByID = (req, res) => {
  // console.log(req.body);
  const sql =
    "select employee_id, name as manager from inv.employees where employee_id != ? ;";
  const { employee_id } = req.body;
  db.query(sql, [employee_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to Get Managers By EmpID" });
    }
    console.log(result);
    return res.status(200).json(result);
  });
};

const CheckEmpNameExist = (req, res) => {
  // console.log(req.body);
  const sql =
    "select case when exists (select employee_id from inv.employees where name = ? ) then 1 else 0 end as name;";
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

const DeleteEmp = (req, res) => {
  // console.log(req.body);
  const sql =
    "delete e, a from inv.employees e left outer join inv.accounts a on e.account_id=a.account_id where e.employee_id= ?;";
  const { employee_id } = req.body;
  db.query(sql, [employee_id], (err, result) => {
    if (err) {
      console.error("Database get error:", err);
      return res.status(500).json({ error: "Failed to Delete Employee." });
    }
    console.log(result);
    return res.status(200).json(result);
  });
};

module.exports = {
  addEmployee,
  editEmployee,
  getEmployeeByID,
  getAllEmployees,
  getAllManagers,
  CheckEmpNameExist,
  getAllManagersByID,
  DeleteEmp,
};
