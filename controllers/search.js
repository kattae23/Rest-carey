const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const allowCollections = [
    'users',
    'category',
    'products',
    'roles'
];

const searchUsers = async (term = '', res = response) => {

    const isMongoId = ObjectId.isValid(term);


    if (isMongoId) {
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [user] : []
        });
    }

    const regex = new RegExp(term, 'i'); // expresión regular mayusculas y minusculas
    const users = await User.find({
        $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        $and: [{ status: true }]
    });
    const usersCount = await User.count({
        $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        $and: [{ status: true }]
    });

    res.json({
        results: users
    })
};

const searchCategory = async (term = '', res = response) => {

    const isMongoId = ObjectId.isValid(term);

    if (isMongoId) {
        const category = await Category.findById(term);
        return res.json({
            results: (category) ? [category] : []
        });
    }

    const regex = new RegExp(term, 'i'); // expresión regular mayusculas y minusculas


    const category = await Category.find({ name: regex, status: true });
    const categoryCount = await Category.count({ name: regex, status: true });
    const product = await Product.find({ category: category })

    res.json({
        results: category,
        product
    })

}

const searchProducts = async (term = '', res = response) => {

    const isMongoId = ObjectId.isValid(term); // devuelve un true o un false

    if (isMongoId) {
        const product = await Product.findById(term)
            .populate('category', 'name');
        return res.json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp(term, 'i'); // expresión regular mayusculas y minusculas basicamente busca de todo 


    // const product = await Product.find({ name: regex, status: true })
    const product = await Product.find({
        $or: [{ name: regex }],
        $and: [{ status: true }]
    })
        .populate('category', 'name') // añadiendo la categoria a la busqueda del producto, también se puede añadir al usuario para saber de quien es
        .populate('user', ['firstName', 'lastName']); // añadiendo la categoria a la busqueda del producto, también se puede añadir al usuario para saber de quien es
    const productCount = await Product.count({ name: regex, status: true });

    const regex2 = new RegExp(term, 'i'); // expresión regular mayusculas y minusculas
    const users = await User.find({
        $or: [{ firstName: regex2 }, { lastName: regex2 }, { email: regex2 }],
        $and: [{ status: true }]
    });
    const usersCount = await User.count({
        $or: [{ firstName: regex2 }, { lastName: regex2 }, { email: regex2 }],
        $and: [{ status: true }]
    });

    const category = await Category.find({
        $or: [{ name: regex2 }],
        $and: [{ status: true }]
    });

    res.json({
        product,
        productCount,
        users,
        category
    })

}



const search = async (req = request, res = response) => {

    const { collection, term } = req.params;

    if (!allowCollections.includes(collection)) {
        return res.status(400).json({
            msg: `The allow collections are: ${allowCollections}`
        })
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'category':
            searchCategory(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;

        default:
            res.status(500).json({
                msg: 'i forget to do the search'
            })
    }
}

module.exports = {
    search
}