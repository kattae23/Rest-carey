

const { Router } = require('express');
const { check } = require('express-validator');
const { downloadFile, updateFile, getImage } = require('../controllers/uploads');
const { allowCollections } = require('../helpers/db-validators');
const { validateFields, validateFileToUpload, validateJWT } = require('../middlewares');

const router = Router();


router.post('/', validateFileToUpload, downloadFile)

router.put('/:collection/:id', [
    validateFileToUpload,
    check('id', 'Is not a valid mongo ID').isMongoId(),
    check('collection').custom(c => allowCollections(c, ['users', 'products','backgrounds'])),
    validateFields,
], updateFile);

router.get('/:collection/:id',[
    check('id', 'Is not a valid mongo ID').isMongoId(),
    check('collection').custom(c => allowCollections(c, ['users', 'products','backgrounds'])),
    validateFields,
], getImage )






module.exports = router;