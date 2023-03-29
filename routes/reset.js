
const { Router } = require('express');
const { check } = require('express-validator');

const { changePassword, resetPassword } = require('../controllers/renewPassword')

const router = Router();

router.get('/reset-password/:token/:id', [
    // check('token').custom(emailExistRenew),
    // check('id').custom(emailExistRenew),
    // validateFields
], changePassword);

router.post('/reset-password/:token/:id', [
    // check('token').custom(emailExistRenew),
    // check('id').custom(emailExistRenew),
    // validateFields
], resetPassword);


module.exports = router;