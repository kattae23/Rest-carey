const { request, response } = require("express");

const path = require('path');
const { v4: uuidv4 } = require('uuid');
const compressImages = require("compress-images")
const fileSystem = require("fs")


const uploadFile = async (files, allowExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg'], folder = '') => {

    return new Promise((resolve, reject) => {

        const { file } = files;

        const image = file;

        const nameCut = file.name.split('.');

        const extension = nameCut[nameCut.length - 1]

        // validate extension
        if (!allowExtensions.includes(extension)) {
            return reject(`The extension '${extension}' is not a valid extension, allowed extensions: ${allowExtensions}`)
        }

        const nameTemp = uuidv4() + '.' + extension;

        const uploadPath = path.join(__dirname, '../uploads/', folder, nameTemp);

        fileSystem.readFile(image.tempFilePath, function (error, data) {
            if (error) throw error

            const fileName = nameTemp

            const filePath = "uploads/" + fileName

            const compressedFilePath = uploadPath

            const compression = 60

            fileSystem.writeFile(filePath, data, async function (error) {
                console.log(data)
                if (error) throw error

                compressImages(filePath, compressedFilePath, { compress_force: false, statistic: true, autoupdate: true }, false,
                    { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
                    { png: { engine: "pngquant", command: ["--quality=" + compression + "-" + compression, "-o"] } },
                    { svg: { engine: "svgo", command: "--multipass" } },
                    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
                    async function (error, completed, statistic) {
                        fileSystem.unlink(filePath, function (error) {
                            if (error) throw error
                        })
                        if (completed === true) {
                            const fileCompressed = path.join(__dirname, '../uploads/', folder, nameTemp + nameTemp);
                            fileSystem.rename(fileCompressed, uploadPath, function (err) {
                                if (err) throw err
                                resolve(nameTemp);
                            })
                        }
                    })
            })
        })
    });
}


module.exports = {
    uploadFile
}