const { request, response } = require('express');
const { uploadFile } = require('../helpers/upload-file');
const path = require('path')
const fs = require('fs')

const { User, Product } = require('../models')

const allowExtensions = ['png', 'jpg']


const downloadFile = async (req = request, res = response) => {

    try {
        const name = await uploadFile(req.files, undefined, 'imgs')
        res.json({ name })
    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const updateFile = async (req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Dont exist a user with that id ${id}`
                })
            }

            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Dont exist a product with that id ${id}`
                })
            }

            break;

        case 'backgrounds':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Dont exist a background with that id ${id}`
                })
            }

            break;

        default:
            return res.status(500).json({ msg: 'i forget validate that' })
    }

    if (collection === 'backgrounds') {
        if (model.backgroundImg) {
            // hay que borrar la imagen del servidor
            const pathImg = path.join(__dirname, '../uploads', collection, model.backgroundImg);
            if (fs.existsSync(pathImg)) {
                fs.unlinkSync(pathImg);
            }
        }
        const name = await uploadFile(req.files, undefined, collection);
        model.backgroundImg = name;

        await model.save();
        res.json(model)
        return;
    }

    // Clean preview images 
    if (model.img) {
        // hay que borrar la imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg);
        }
    }


    const name = await uploadFile(req.files, undefined, collection);
    model.img = name;
    // if (collection === 'products') {
    //     if (model.backgroundImg) {
    //         // hay que borrar la imagen del servidor
    //         const pathImg = path.join(__dirname, '../uploads', collection, model.backgroundImg);
    //         if (fs.existsSync(pathImg)) {
    //             fs.unlinkSync(pathImg);
    //         }
    //     }
    //     const name = await uploadFile(req.files, undefined, collection);
    //     model.backgroundImg = name;

    //     await model.save();
    //     res.json(model)
    //     return;
    // }
    model.urlImgThumb = process.env.SERVER_URL + 'uploads/' + collection + '/' + model._id + '?' + Date.now();
    // guardando lo que sea con url del servidor
    // model.img = process.env.SERVER_URL + 'uploads/' + collection + '/' + model._id;

    await model.save();
    res.json(model)
}


const getImage = async (req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Dont exist a user with that id ${id}`
                })
            }

            break;
        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Dont exist a product with that id ${id}`
                })
            }

            break;
        case 'backgrounds':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `Dont exist a background with that id ${id}`
                })
            }

            break;

        default:
            return res.status(500).json({ msg: 'i forget validate that' })
    }

    // if (collection === 'users') {
    //     if (model.img) {
    //         // hay que borrar la imagen del servidor
    //         const pathImg = path.join(__dirname, '../uploads', collection, model.img);
    //         if (fs.existsSync(pathImg)) {
    //             return res.sendFile(pathImg)
    //         }
    //     }
    //     const pathImg = path.join(__dirname, '../assets/no-user.png');
    //     res.sendFile(pathImg)
    //     return;
    // }

    if (collection === 'backgrounds') {
        if (model.backgroundImg) {
            // hay que borrar la imagen del servidor
            const pathImg = path.join(__dirname, '../uploads', collection, model.backgroundImg);
            if (fs.existsSync(pathImg)) {
                return res.sendFile(pathImg)
            }
        }
        const pathImg = path.join(__dirname, '../assets/no-image.jpg');
        res.sendFile(pathImg)
        return;
    }

    // Clean preview images 
    if (model.img) {
        // hay que borrar la imagen del servidor
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImg)) {
            return res.sendFile(pathImg)
        }
    }

    const pathImg = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImg)

}





module.exports = {
    downloadFile,
    updateFile,
    getImage,
}