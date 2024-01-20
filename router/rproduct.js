import express from "express";
import { allProducts, confirmProduct, createProduct, deleteProduct, downloadProduct, productById, productsByCategory, rejectProduct, waitingById, waitingList } from '../controllers/products.js';

const rproduct = new express.Router()

rproduct.get('/products', allProducts);
rproduct.get('/download/:id', downloadProduct);
rproduct.get('/products/vid/:vid', productById);
rproduct.get('/products/:ctg', productsByCategory);

rproduct.post('/product', createProduct);
rproduct.post('/waiting/vid/:vid', waitingById);
rproduct.post('/product/reject', rejectProduct);
rproduct.post('/product/confirm', confirmProduct);
rproduct.post('/products/waitinglist', waitingList);

rproduct.delete('/product/:id', deleteProduct);

export default rproduct;