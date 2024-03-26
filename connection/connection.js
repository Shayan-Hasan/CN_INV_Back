const { createPool } = require("mysql2");

const pool = createPool({
  host: "localhost",
  user: "root",
  port: 3306,
  password: "12345",
  database: "inv",
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection failed. Exiting now...");
    console.error(err);
    process.exit(1);
  }
  console.log("Successfully connected to the database");
  connection.release();
});

module.exports = pool;
