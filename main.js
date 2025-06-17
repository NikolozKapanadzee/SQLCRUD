const express = require("express");
const {
  getAllProducts,
  getProductsByID,
  createProduct,
  deleteProductById,
} = require("./config/connectToSQL");
const app = express();
app.use(express.json());

app.get("/products", async (req, res) => {
  const resp = await getAllProducts();
  res.json(resp);
});
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const resp = await getProductsByID(id);
  res.json(resp);
});
app.post("/products", async (req, res) => {
  const { name, price, available } = req.body;
  const insertedData = await createProduct(name, price, available);
  res.status(201).json({
    message: "Product created successfully",
    product: insertedData,
  });
});
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await deleteProductById(id);
  if (!deletedProduct) {
    return res.status(404).json({ message: "product not found" });
  }
  res.json({
    message: "product deleted successfully",
    product: deletedProduct,
  });
});
app.listen(3000, () => {
  console.log(`server is running on port http://localhost:3000`);
});
