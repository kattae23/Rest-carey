const { Router } = require('express');
const { sendEmailContact } = require('../controllers/contact');
const { validateJWT } = require('../middlewares');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/', [
    // validateJWT,
    // validateFields
], sendEmailContact );

// router.post('/', [
//     validateJWT,
//     validateFields
// ], googleSignIn );





module.exports = router;