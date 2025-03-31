const pool = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const salesQuery = await pool.query(
      "SELECT SUM(total_price) FROM orders WHERE created_at >= CURRENT_DATE"
    );
    const ordersQuery = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE created_at >= CURRENT_DATE"
    );
    const usersQuery = await pool.query("SELECT COUNT(*) FROM users");

    const chartDataQuery = await pool.query(
      "SELECT EXTRACT(MONTH FROM created_at) AS month, SUM(total_price) FROM orders GROUP BY month ORDER BY month"
    );

    const stats = {
      sales: salesQuery.rows[0].sum || 0,
      orders: ordersQuery.rows[0].count || 0,
      users: usersQuery.rows[0].count || 0,
      chart_data: chartDataQuery.rows.map((row) => ({
        label: row.month,
        sales: row.sum,
      })),
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard stats", error });
  }
};
