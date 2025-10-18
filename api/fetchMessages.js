import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  try {
    const result = await pool.query("SELECT * FROM messages ORDER BY created_at DESC LIMIT 10");
    res.status(200).json({ success: true, messages: result.rows });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching messages" });
  }
}
