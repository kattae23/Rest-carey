
const { Router } = require('express');
const { check } = require('express-validator');

const { usersGet, usersPut, usersDelete, usersPatch, usersPost, usersById } = require('../controllers/users');
const { isRoleValid, emailExist, userExistById, emailExistRenew } = require('../helpers/db-validators');
const { validateFields, validateJWT, isAdminRole, haveRole } = require('../middlewares')
const { changePassword, renewPassword } = require('../controllers/renewPassword')

const router = Router();

router.get('/', usersGet);


router.get('/:id',
    [
        check('id', 'Is not a valid id').isMongoId(),
        check('id').custom(userExistById),
    ]
    , usersById);

router.put('/:id', [
    check('id', 'Is not a valid id').isMongoId(),
    check('id').custom(userExistById),
    check('email').custom(emailExist),
    check('role').custom(isRoleValid),
], usersPut);

router.post('/', [
    check('firstName', 'The first name is required').not().isEmpty(),
    check('lastName', 'The last name is required').not().isEmpty(),
    check('email').custom(emailExist),
    check('password', 'Password must be at least 8 characters and less than 20').isLength({ min: 8, max: 20 }),
    check('role').custom(isRoleValid),
    validateFields
], usersPost);

router.delete('/:id', [
    validateJWT,
    // isAdminRole,
    haveRole('ADMIN_ROLE', 'SALES_ROLE'),
    check('id', 'Is not a valid id').isMongoId(),
    check('id').custom(userExistById),
    validateFields
], usersDelete);

router.patch('/', usersPatch);


router.post('/renew-password', [
    check('email').custom(emailExistRenew),
    // validateFields
], renewPassword);

router.get('/reset-password', [
    // check('token').custom(emailExistRenew),
    // check('id').custom(emailExistRenew),
    // validateFields
], changePassword);


module.exports = router;