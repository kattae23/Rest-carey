const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const { createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct } = require('../controllers/products');

const { categoryExistById, productExistById } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', getProducts);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'Is not a valid mongo ID').isMongoId(),
    validateFields,
], getProductById);

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validateJWT,
    check('name', 'The Name is required').not().isEmpty(),
    check('category', 'Is not a valid mongo ID').isMongoId(),
    check('category').custom(categoryExistById),
    validateFields
], createProduct);

// Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validateJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    validateFields
], updateProduct);

// Borrar una categoria - Admin
router.delete('/:id', [
    validateJWT,
    // isAdminRole,
    check('id', 'Is not a valid mongo ID').isMongoId(),
    validateFields,
], deleteProduct);


module.exports = router;