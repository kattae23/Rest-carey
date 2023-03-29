

const dbValidators = require('./db-validators')
const createJWT = require('./create-jwt')
const googleVerify = require('./google-verify')
const uploadFiles = require('./upload-file')



module.exports = {
    ...dbValidators,
    ...createJWT,
    ...googleVerify,
    ...uploadFiles,
}