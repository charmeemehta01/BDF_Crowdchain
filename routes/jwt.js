const express = require('express');
const router = express.Router();
const jwtController = require('../controller/jwt');
router.post('/create', jwtController.create);
router.post('/authenticate', jwtController.authenticate);

module.exports = router;