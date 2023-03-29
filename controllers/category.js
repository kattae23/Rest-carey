const { request, response } = require("express");
const { Category } = require("../models");

// obtenerCategorias - paginado - total - populate

const getCategorys = async (req = requst, res = response) => {

    // const { q, nombre = 'no name', apikey, page = 1, limit } = req.query;
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true }

    // const users = await User.find(query)
    //     .skip(Number(from))
    //     .limit(Number(limit));

    // const total = await User.countDocuments(query);
    // al ponerlos en el array le pones un nombre a la primera promesa y un nombre a la segunda, se nombran por el orden
    const [total, category] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', ['firstName', 'lastName'])
            .skip(Number(from))
            .limit(Number(limit))

    ])

    res.json({
        total,
        category
    });
}

// obtenercategoria - populate 
const getCategoryById = async (req = request, res = response) => {

    const { id } = req.params;
    const category = await Category.findById(id).populate('user', ['firstName', 'lastName'])

    res.status(200).json(category)

}


const createCategory = async (req = request, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name })

    if (categoryDB) {
        return res.status(400).json({
            msg: `The category ${categoryDB.name} already exist.`
        });
    };

    // Generar la data a guardar
    const data = {
        name,
        user: req.user._id
    }

    const category = new Category(data);

    // Guardar DB

    await category.save();

    res.status(201).json({
        category
    })

}

// actualizarcategoria 
const updateCategory = async (req = request, res = response) => {

    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.json(category)



}
// borrarCategoria - state: false

const deleteCategory = async (req = request, res = response) => {
    const { id } = req.params;

    //Fisicamente lo borramos
    // const user = await User.findByIdAndDelete( id );
    const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });


    res.json(category);
}


module.exports = {
    createCategory,
    getCategorys,
    getCategoryById,
    updateCategory,
    deleteCategory,
}