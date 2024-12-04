const express = require('express');
const PaymentController = require('../controllers/paymentController');
const { checkAuthentication } = require('../middlewares/authMiddleware'); // Importa o middleware
const router = express.Router();

// Rota para pagamento via cartão de crédito (autenticada)
router.post('/credit-card', checkAuthentication, PaymentController.processCreditCardPayment);

// Rota para pagamento via PIX (autenticada)
router.post('/pix', checkAuthentication, PaymentController.processPixPayment);

// Rota para consultar transação (autenticada)
router.get('/status/:transactionId', checkAuthentication, PaymentController.getTransactionStatus);

module.exports = router;
