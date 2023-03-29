const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategorys, getCategoryById, updateCategory, deleteCategory } = require('../controllers/category');
const { categoryExistById } = require('../helpers/db-validators');

const { validateFields, validateJWT, isAdminRole } = require('../middlewares');

const router = Router();

/**
 * {{url}}/api/categories
 */

// Obtener todas las categorias - publico
router.get('/', getCategorys)

// Obtener una categoria en particular por id - publico
router.get('/:id', [
    check('id', "It's not a mongo id").isMongoId(),
    check('id').custom(categoryExistById),
    validateFields,
], getCategoryById)

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    validateFields,
], createCategory)

// Actualizar registros por id - privado - cualquier persona con un token valido
router.put('/:id', [
    validateJWT,
    check('name', 'The name is required').not().isEmpty(),
    check('id').custom(categoryExistById),
    validateFields,
], updateCategory)

// Borrar una categoria - Admin
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id').custom(categoryExistById),
    validateFields,
], deleteCategory)




module.exports = router;