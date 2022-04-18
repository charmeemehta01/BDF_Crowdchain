const express = require('express');
const router = express.Router();
const mailController = require('../controller/mail');
router.post('/signup', mailController.signup);
//router.post('/change_pass', mailController.change_pass);
router.post('/update_details', mailController.update_details);
router.post('/accept_status', mailController.accept_status);
router.post('/reject_status', mailController.reject_status);
router.post('/donator', mailController.donator);
router.post('/creator', mailController.creator);
router.post('/camp_create', mailController.camp_create);

module.exports = router;