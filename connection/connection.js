const { createPool } = require("mysql2");

const pool = createPool({
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "shayan1!",
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
