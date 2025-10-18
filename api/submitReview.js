// File: /api/submitReview.js
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Only POST requests allowed" });
  }

  const { name, email, message, rating } = req.body || {};

  if (!name || !email || !message || !rating) {
    return res.status(400).json({ success: false, message: "All fields and a rating are required" });
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Invalid rating value." });
  }

  try {
    // Notice the new 'rating' column and $4 placeholder
    await pool.query(
      "INSERT INTO messages (name, email, message, rating) VALUES ($1, $2, $3, $4)",
      [name, email, message, rating]
    );
    res.status(200).json({ success: true, message: "Review submitted successfully!" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ success: false, message: "Database error" });
  }
}