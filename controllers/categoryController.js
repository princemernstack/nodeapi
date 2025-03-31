const pool = require("../config/db");

exports.addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    res
      .status(201)
      .json({
        message: "Category created successfully",
        category: result.rows[0],
      });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

exports.updateCategory = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Category not found" });
    res
      .status(200)
      .json({
        message: "Category updated successfully",
        category: result.rows[0],
      });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
