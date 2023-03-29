const { request, response } = require("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { createJWT } = require("../helpers/create-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async (req = request, res = response) => {

    const { email, password } = req.body;

    try {

        // verificar si el email existe
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                msg: 'That email does not exist'
            })
        }

        // Si el usuario está activo
        if (user.status === false) {
            return res.status(400).json({
                msg: 'Your account has been block'
            })
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'The password is incorrect'
            })
        }

        // Generar el JSON WEB TOKEN JWT
        const token = await createJWT(user._id, '30h');
        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Something goes wrong, talk with the administrator'
        })
    }

}

const googleSignIn = async (req = request, res = response) => {

    const { id_token } = req.body;

    try {

        const { firstName, lastName, email, img } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            // Tengo que crear el usuario
            const data = {
                google: true,
                firstName,
                lastName,
                email,
                password: 'p4ssw0rd',
                img,
                role: 'USER_ROLE',
                urlImgThumb: img,
                urlBackgroundImgThumb: ''
            };
            user = new User(data);
            user.urlBackgroundImgThumb = process.env.SERVER_URL + 'uploads/backgrounds/' + user._id;

            await user.save();
        }

        // Si el usuario en base de datos
        if (!user.status) {
            return res.status(401).json({
                msg: 'Talk with the administrator - user block'
            });
        }

        // Generar el JSON WEB TOKEN JWT
        const token = await createJWT(user._id, '30h');

        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: "The token can't not be verified"
        })
    }
}

const renewToken = async (req, res = response) => {

    const { user } = req

    // generar nuevo JWT y retornarlo en esta petición
    const token = await createJWT(user._id, '30h');

    res.json({
        user,
        token
    })
}


module.exports = {
    googleSignIn,
    login,
    renewToken,
}