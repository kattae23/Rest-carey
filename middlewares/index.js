


const validateFields = require('../middlewares/validate-fields');
const validateJWT = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-roles');
const validateFileToUpload = require('../middlewares/validate-file');


module.exports = {
    ...validateFields,    
    ...validateJWT,   
    ...validateRoles,
    ...validateFileToUpload,
}