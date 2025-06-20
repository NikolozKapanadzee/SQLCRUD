const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql
  .createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
  })
  .promise();

const getAllProducts = async () => {
  const [result] = await pool.query("SELECT * FROM products");
  return result;
};
const getProductsByID = async (id) => {
  const [result] = await pool.query(
    `
        SELECT * FROM products WHERE id = ? 
        `,
    [id]
  );
  return result[0];
};
const createProduct = async (name, price, available) => {
  const [result] = await pool.query(
    `
      INSERT INTO products (name, price, available)
      VALUES (?, ?, ?)
    `,
    [name, price, available]
  );
  const insertedData = await getProductsByID(result.insertId);
  return insertedData;
};
const deleteProductById = async (id) => {
  const product = await getProductsByID(id);
  if (!product) return null;
  await pool.query(
    `
    DELETE FROM products WHERE id = ?
    `,
    [id]
  );
  return product;
};
const updateProductById = async (id, name, price, available) => {
  const product = await getProductsByID(id);
  if (!product) return null;
  await pool.query(
    `
    UPDATE products
    SET name = ?, price = ?, available = ?
    WHERE id = ?
    `,
    [name, price, available, id]
  );
  const updatedProduct = await getProductsByID(id);
  return updatedProduct;
};
const getProductsByPriceRange = async (priceFrom, priceTo) => {
  const [result] = await pool.query(
    `SELECT * FROM products WHERE price BETWEEN ? AND ?`,
    [priceFrom, priceTo]
  );
  return result;
};
const getAvailableProducts = async (available) => {
  let isAvailable;
  if (available === "true") {
    isAvailable = 1;
  } else if (available === "false") {
    isAvailable = 0;
  }
  const [result] = await pool.query(
    `SELECT * FROM products WHERE available = ?`,
    [isAvailable]
  );
  return result;
};

module.exports = {
  getAllProducts,
  getProductsByID,
  createProduct,
  deleteProductById,
  updateProductById,
  getProductsByPriceRange,
  getAvailableProducts,
};
