// File: /api/fetchReviews.js
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  try {
    // 1. Get all reviews (email is excluded for privacy)
    const reviewsQuery = "SELECT name, message, rating, created_at FROM messages ORDER BY created_at DESC";
    const reviewsResult = await pool.query(reviewsQuery);
    
    // 2. Get overall statistics
    const statsQuery = "SELECT AVG(rating) as average, COUNT(id) as total FROM messages";
    const statsResult = await pool.query(statsQuery);
    const stats = statsResult.rows[0] || { average: 0, total: 0 };
    
    // 3. Get count for each star rating
    const breakdownQuery = "SELECT rating, COUNT(id) as count FROM messages GROUP BY rating";
    const breakdownResult = await pool.query(breakdownQuery);

    // Format breakdown for easy use on the frontend
    const breakdown = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };
    breakdownResult.rows.forEach(row => {
        breakdown[row.rating] = parseInt(row.count, 10);
    });

    res.status(200).json({
      success: true,
      data: {
        reviews: reviewsResult.rows,
        average: parseFloat(stats.average || 0).toFixed(1),
        total: parseInt(stats.total, 10),
        breakdown: breakdown,
      },
    });

  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching review data" });
  }
}