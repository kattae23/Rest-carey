const { response, request } = require('express');
const User = require('../models/user');
// para encriptar
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');


const usersGet = async (req = request, res = response) => {

    // const { q, nombre = 'no name', apikey, page = 1, limit } = req.query;
    const { limit = 5, from = 0 } = req.query;
    const query = {}

    // const users = await User.find(query)
    //     .skip(Number(from))
    //     .limit(Number(limit));

    // const total = await User.countDocuments(query);
    // al ponerlos en el array le pones un nombre a la primera promesa y un nombre a la segunda, se nombran por el orden
    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total,
        users
    });
};

const usersById = async (req, res = response) => {
    const { id } = req.params;
    const user = await User.findById(id)
    try {
        if (!user) {
            res.json({
                msg: 'Dont exist a user with that id'
            })
        } else {
            res.json({
                user
            });

        }
    } catch (error) {
        console.log(error)
        res.json({
            msg: 'Dont exist a user with that id'
        });
    }
}

const usersPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, ...rest } = req.body;

    // TODO Validar contra base de datos
    if (password) {
        // encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest, { new: true })

    res.json(user);
}

const usersPost = async (req, res) => {


    const { firstName, lastName, email, password, role, } = req.body;
    const user = new User({ firstName, lastName, email, password, role });

    // encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);


    // guardar con imagen
    // asegurate de que no se esté repitiendo algún slash por error
    user.img = process.env.SERVER_URL + 'uploads/users/' + user._id;
    user.urlImgThumb = process.env.SERVER_URL + 'uploads/users/' + user._id + '?' + Date.now();
    user.urlBackgroundImgThumb = process.env.SERVER_URL + 'uploads/backgrounds/' + user._id;

    // guardar en la base de datos
    await user.save();


    res.status(201).json({
        user
    });
}

const usersDelete = async (req, res) => {

    const { id } = req.params;
    const uid = req.uid;

    //Fisicamente lo borramos
    // const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate(id, { status: false }, { new: true });

    res.json(user);
}

const usersPatch = (req, res) => {
    res.json({
        ok: true,
        msg: 'patch API - controller'
    });
}



module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch,
    usersById,
};