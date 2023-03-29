const Role = require('../models/role')
// const { response, request } = require('express');
const { Category, User, Product } = require("../models");



const isRoleValid = async (role = '') => {
    const roleExist = await Role.findOne({ role })
    if (!roleExist) {
        throw new Error(`The role ${role} is not registered in the Database`)
    }
};

const emailExist = async (email = '') => {

    //Verificar si el correo existe
    const emailExist = await User.findOne({ email });
    if (emailExist) {
        throw new Error(`The email: '${email}' is already registered`)
    }
}

const emailExistRenew = async (email = '') => {

    // Verificar si el correo existe
    const emailExist = await User.findOne({ email });

    if (!emailExist) {
        throw new Error(`The email: '${email}' don't exist`)
    }
}

const userExistById = async (id) => {

    //Verificar si el correo existe
    const userExist = await User.findById(id);
    if (!userExist) {
        throw new Error(`there is no user with that id`)
    }
}
/**
 * categorias
 */

const categoryExistById = async (id) => {

    //Verificar si el correo existe
    const categoryExist = await Category.findById(id);
    if (!categoryExist) {
        throw new Error(`There's no a category with that id`)
    }
}
/**
 * products
 */

const productExistById = async (id) => {

    //Verificar si el correo existe
    const productExist = await Product.findById(id);
    if ( !productExist ) {
        throw new Error(`That product already exist ${ id }`)
    }
}

/**
 *  validate CollectionsAllow 
 */
const allowCollections = ( collection = '', collections = []) => {

    const include = collections.includes( collection );

    if ( !include ) {
        throw new Error(`The collection ${collection} is not allowed, allowed Extensions: ${collections}`)
    }

    return true;

}




module.exports = {
    isRoleValid,
    emailExist,
    userExistById,
    categoryExistById,
    productExistById,
    allowCollections,
    emailExistRenew,
}