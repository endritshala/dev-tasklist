const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;

// environment variables for database connection
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_PORT || 5500,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "Endrit.3009",
  database: process.env.MYSQL_DATABASE || "pabaudata",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(cors());
app.use(bodyParser.json());

// API endpoint to fetch bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM bookings");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Database query failed", error: err });
  }
});

// API endpoint to fetch a single booking by ID
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM bookings WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

// API endpoint to insert a booking
app.post("/api/bookings", async (req, res) => {
  const { service, doctor_name, start_time, end_time, date } = req.body;
  const insertQuery =
    "INSERT INTO bookings (service, doctor_name, start_time, end_time, date) VALUES (?, ?, ?, ?, ?)";

  try {
    await pool.query(insertQuery, [
      service,
      doctor_name,
      start_time,
      end_time,
      date,
    ]);
    res.status(201).send("Booking inserted successfully");
  } catch (error) {
    console.error("Error inserting booking:", error);
    res.status(500).send("Internal Server Error");
  }
});

// API endpoint to delete a booking by ID and reset the increment
app.delete("/api/bookings/:id", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    const result = await connection.query("DELETE FROM bookings WHERE id = ?", [
      id,
    ]);

    if (result[0].affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: "Booking not found" });
    }
    const [rows] = await connection.query(
      "SELECT COUNT(*) AS count FROM bookings"
    );

    if (rows[0].count === 0) {
      await connection.query("ALTER TABLE bookings AUTO_INCREMENT = 1");
    }

    await connection.commit();
    res.status(200).send("Booking deleted successfully");
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Failed to delete booking" });
  } finally {
    connection.release();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
