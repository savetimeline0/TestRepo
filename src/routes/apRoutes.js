const express = require('express');
const router = express.Router();
const controller = require('../controllers/apController');

router.get('/invoices', controller.list);
router.get('/invoices/:id', controller.get);
router.post('/invoices', controller.create);
router.put('/invoices/:id', controller.update);
router.post('/invoices/:id/pay', controller.pay);
router.delete('/invoices/:id', controller.remove);

module.exports = router;
