const { response, request } = require("express");
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { appengine_v1 } = require("googleapis");
const { User } = require("../models");
const handlebars = require('handlebars');
const { promisify } = require('util');
const fs = require('fs');
const { createJWT } = require("../helpers/create-jwt");
const jwt = require('jsonwebtoken');
const path = require('path');


const readFile = promisify(fs.readFile);

const renewPassword = async (req = require, res = response) => {

    const { email } = req.body

    const user = await User.findOne({ email });

    try {
        if (!user) {
            res.json({
                msg: 'Dont exist a user with that email'
            })
        } 
    } catch (error) {
        console.log(error)
        res.json({
            msg: 'Dont exist a user with that email'
        });
    }

    const token = await createJWT(user._id, '3h');

    const htmlPath = path.join(__dirname, 'renewpage', 'index.html');

    let html = await readFile(htmlPath, 'utf8');
    let template = handlebars.compile(html);
    URL_FRONT_END = process.env.URL_FRONT_END;
    let data = {
        urlRedirect: URL_FRONT_END + `auth/reset-password/${token}/${user._id}`,
        urlChangePassword: URL_FRONT_END + 'auth/renew-password',
    };
    let htmlToSend = template(data);


    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_SECRET_ID;
    const refresh_token = process.env.GOOGLE_REFRESH_TOKEN;
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
    const emailServer = process.env.GOOGLE_EMAIL

    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI)

    oAuth2Client.setCredentials({ refresh_token: refresh_token })

    async function sendMail() {

        try {

            const accessToken = await oAuth2Client.getAccessToken()

            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: emailServer,
                    clientId: clientId,
                    clientSecret: clientSecret,
                    refreshToken: refresh_token,
                    accessToken: accessToken
                }
            })

            const mailOptions = {
                from: "Carey's App  <wait550000@gmail.com>",
                to: user.email,
                subject: "Password Reset",
                text: htmlToSend,
                html: htmlToSend
            }

            const result = await transport.sendMail(mailOptions)

            return result

        } catch (error) {
            console.log(error)
            return error
        }
    }

    const link = `${URL_FRONT_END}auth/reset-password/${token}/${user._id}`

    sendMail()
        .then(result => console.log('email sent...', result))
        // .then(result => console.log(link))
        // .then(data => res.status(200).json({ user, token, data }))
        .then(data => res.status(200).json({ msg: "email sent...", data }))
        .catch(error => console.log(error.message))
        .catch(error => res.status(500).json({ msg: error.message }))
}


const changePassword = async (req = request, res = response) => {

    const { token, id } = req.params

    const user = await User.findById(id)
    try {
        if (!user) {
            res.json({
                msg: 'Dont exist a user with that id'
            })
        } 
    } catch (error) {
        console.log(error)
        res.json({
            msg: 'Dont exist a user with that id'
        });
    }

    try {
        const public_key = process.env.SECRETORPRIVATEKEY;
        const verify = jwt.verify(token, public_key)
        if (!verify) {
            return res.status(401).json({ msg: "invalid token, not verified" })
        }
        const newToken = await createJWT(user._id, '30h');
        return res.status(200).json({ user, token: newToken})
    } catch (error) {
        console.log(error)
        return res.status(401).json({ msg: "Not Verified" })
    }

}

const resetPassword = async (req = request, res = response) => {

    const { token, id } = req.params

    const user = await User.findById(id)
    try {
        if (!user) {
            res.json({
                msg: 'Dont exist a user with that id'
            })
        } 
    } catch (error) {
        console.log(error)
        res.json({
            msg: 'Dont exist a user with that id'
        });
    }

    try {
        const public_key = process.env.SECRETORPRIVATEKEY;
        const verify = jwt.verify(token, public_key)
        if (!verify) {
            return res.status(401).json({ msg: "invalid token" })
        }
        console.log(verify)
        return res.status(200).json({ msg: "Verified!!" })
    } catch (error) {
        console.log(error)
        return res.status(401).json({ msg: "Not Verified" })
    }

}


module.exports = {
    renewPassword,
    changePassword,
    resetPassword
}