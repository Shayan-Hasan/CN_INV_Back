const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", productController.getProduct);
router.get("/getallProducts", productController.getProducts);
router.get("/getProductsByStoreId", productController.getProductsByStoreId);
router.get("/getAllProductsInv", productController.getAllProductsInv);
router.get("/getProductNameCode", productController.getProductNameCode);
router.post("/ProductInAllStores", productController.ProductInAllStores);
router.post(
  "/addProduct",
  upload.single("video"),
  productController.addProduct
);
router.post("/getProductById", productController.getProductById);
router.put(
  "/editProductApi",
  upload.single("video"),
  productController.editProductApi
);
router.get("/getProductNameCodeInv", productController.getProductNameCodeInv);
router.post("/getProductByIdSale", productController.getProductByIdSale);
router.post(
  "/addProductImage",
  upload.single("product_image"),
  productController.addProductImage
);
router.post("/getProductImagesById", productController.getProductImagesById);
router.post(
  "/editProductImagesById",
  upload.single("product_image"),
  productController.editProductImagesById
);
router.post("/getProductVideoById", productController.getProductVideoById);
router.post(
  "/CheckProdNameCodeExist",
  productController.CheckProdNameCodeExist
);

router.get("/GetAllProductListSup", productController.GetAllProductListSup);

module.exports = router;
