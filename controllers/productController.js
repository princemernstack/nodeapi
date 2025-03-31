const pool = require("../config/db");

exports.getProducts = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  try {
    const offset = (page - 1) * limit;

    const query = {
      text: "SELECT * FROM products WHERE name ILIKE $1 LIMIT $2 OFFSET $3",
      values: [`%${search}%`, limit, offset],
    };

    const result = await pool.query(query);

    const countQuery = await pool.query(
      "SELECT COUNT(*) FROM products WHERE name ILIKE $1",
      [`%${search}%`]
    );
    const totalItems = countQuery.rows[0].count;

    res.status(200).json({
      products: result.rows,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(totalItems / limit),
        total_items: totalItems,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

exports.addProduct = async (req, res) => {
  const { name, price, category_id, description, status } = req.body;
  try {
    const query = {
      text: "INSERT INTO products (name, price, category_id, description, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      values: [name, price, category_id, description, status],
    };

    const result = await pool.query(query);
    res.status(201).json({
      message: "Product created successfully",
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

exports.updateProduct = async (req, res) => {
  const { name, price, category_id, status, description } = req.body;
  const { id } = req.params;
  try {
    const query = {
      text: "UPDATE products SET name = $1, price = $2, category_id = $3, status = $4 , description = $6 WHERE id = $5 RETURNING *",
      values: [name, price, category_id, status, id, description],
    };

    const result = await pool.query(query);
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
