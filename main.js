const express = require("express");
const {
  getAllProducts,
  getProductsByID,
  createProduct,
  deleteProductById,
  updateProductById,
  getProductsByPriceRange,
} = require("./config/connectToSQL");
const app = express();
app.use(express.json());

app.get("/products", async (req, res) => {
  const { priceFrom, priceTo } = req.query;
  let resp;
  if (priceFrom && priceTo) {
    if (isNaN(priceFrom) || isNaN(priceTo)) {
      return res.status(400).json({ message: "i am waitting for numbers" });
    }
    resp = await getProductsByPriceRange(priceFrom, priceTo);
  } else {
    resp = await getAllProducts();
  }
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
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, available } = req.body;
  const updatedProduct = await updateProductById(id, name, price, available);
  if (!updatedProduct) {
    return res.status(404).json({ message: "product not found" });
  }
  res.json({
    message: "product has been updated",
    product: updatedProduct,
  });
});
app.listen(3000, () => {
  console.log(`server is running on port http://localhost:3000`);
});
