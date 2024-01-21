import express from "express";
import { allProducts, confirmProduct, createProduct, deleteProduct, downloadProduct, productById, productsByCategory, rejectProduct, waitingById, waitingList } from '../controllers/products.js';

const rproduct = new express.Router()

rproduct.get('/products', allProducts);
rproduct.get('/download/:id', downloadProduct);
rproduct.get('/products/vid/:vid', productById);
rproduct.get('/products/:ctg', productsByCategory);

rproduct.post('/product', createProduct);

rproduct.get('/waiting/vid/:vid', waitingById);
rproduct.get('/product/reject/:vid', rejectProduct);
rproduct.get('/product/confirm/:vid', confirmProduct);
rproduct.get('/waitinglist', waitingList);
rproduct.delete('/product/:id', deleteProduct);

export default rproduct;