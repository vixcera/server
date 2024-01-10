import express from 'express';
import reftoken from '../utils/reftoken.js';
import verifyToken from '../middleware/verifyToken.js';
import { placeOrder } from '../controllers/payment.js';
import { administrator } from '../controllers/administrator.js';
import {
  updateUser, getUser, ready, user_login, user_register, user_confirm, user_logout,
} from '../controllers/users.js';
import {
  contributor_confirm, contributor_login, contributor_logout, contributor_register,
} from '../controllers/contributor.js';
import {
  allProducts, confirmProduct, createProduct, deleteProduct, downloadProduct, productById, productsByCategory, rejectProduct, waitingList,
} from '../controllers/products.js';

const router = new express.Router();
router.get('/', ready);

// USERS ROUTES
router.get('/user/:id', verifyToken, getUser);
router.get('/confirm/user/:token', user_confirm);
router.post('/register', user_register);
router.put('/user/update', updateUser);
router.get('/logout', user_logout);
router.post('/login', user_login);

// CONTRIBUTOR ROUTES
router.get('/confirm/contributor/:token', contributor_confirm);
router.post('/register/contributor', contributor_register);
router.post('/login/contributor', contributor_login);
router.get('/logout/contributor', contributor_logout);

// AUTHENTICATION ROUTES
router.post('/payments', placeOrder);
router.get('/reftoken', reftoken);
router.get('/administrator', verifyToken);

// PRODUCT ROUTES
router.get('/products', allProducts);
router.post('/product', createProduct);
router.delete('/product/:id', deleteProduct);
router.get('/download/:id', downloadProduct);
router.post('/product/reject', rejectProduct);
router.post('/product/confirm', confirmProduct);
router.post('/products/waitinglist', waitingList);
router.get('/products/:ctg', productsByCategory);
router.get('/products/vid/:vid', productById);

export default router;
