import express, { Router } from 'express';
import {
    httpPublishOrderCreated,
    httpGetOrderCreated,
    httpDeleteOrderCreated,
    httpPublishOrderUpdated,
    httpDeleteOrderUpdated,
    httpGetOrderUpdated
} from '../../controllers/wc/wc.hooks.controller';
import ordersVerify from '../../middlewares/orders/ordersVerify';
import {
    orderCreatedFilter,
    orderUpdatedFilter,
    productFilter,
    sanitizeBody
} from '../../middlewares/orders/ordersFilters';

const router:Router = express.Router();

/**
 * Description: This is the code to check the status of the API.
 * @param _req Request
 * @param res Response
 * @returns response
 */
router.get('/healthCheck', (_req, res): express.Response => {
    return res.status(200).json({
        message: 'Hooks API Status: OK'
    });
});

/**
 * Description: This is the code to save the order created in the database.
 * Use the middleware to verify the order, filter the order and sanitize the body.
 */
router.post('/hooks/order/created',
    ordersVerify,
    orderCreatedFilter,
    productFilter,
    sanitizeBody,
    httpPublishOrderCreated
);

/**
 * Description: Get all the orders sent by WooCommerce Webhook from the database.
 */
router.get('/hooks/order/created', httpGetOrderCreated);

/**
 * Description: Delete an array of orders from the database by id.
 */
router.delete('/hooks/order/created/delete-array-msg/:msg_id', httpDeleteOrderCreated);

/**
 * Description: Purge created orders from the database.
 */
router.delete('/hooks/order/created', httpDeleteOrderCreated);

/**
 * Description: This is the code to save the order updated in the database.
 * Use the middleware to verify the order, filter the order and sanitize the body.
 */
router.post('/hooks/order/updated',
    ordersVerify,
    orderUpdatedFilter,
    productFilter,
    httpPublishOrderUpdated
);

/**
 * Description: Get all the orders sent by WooCommerce Webhook from the database.
 */
router.get('/hooks/order/updated', httpGetOrderUpdated);

/**
 * Description: Delete an array of orders from the database by id.
 */
router.delete('/hooks/order/updated/delete-array-msg/:msg_id', httpDeleteOrderUpdated);

/**
 * Description: Purge updated orders from the database.
 */
router.delete('/hooks/order/updated', httpDeleteOrderUpdated);

export default router;