const { response, request } = require("express");
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const { appengine_v1 } = require("googleapis");


const sendEmailContact = async (req = request, res = response) => {

    const { firstName, lastName, email, description } = req.body

    // res.json({ firstName, lastName, email, description })

    const contentHtml = `
        <h1>User Information</h1>
        <ul>
            <li>Name: ${firstName} ${lastName}</li>
            <li>User Email: ${email}</li>
            <li>Description: ${description}</li>
            </ul>
            `

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_SECRET_ID;
    const refresh_token = process.env.GOOGLE_REFRESH_TOKEN;
    const REDIRECT_URI= 'https://developers.google.com/oauthplayground'
    const user = process.env.GOOGLE_EMAIL

    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI)

    oAuth2Client.setCredentials({refresh_token: refresh_token})

    async function sendMail() {

        try {
            
            const accessToken = await oAuth2Client.getAccessToken()

            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth:{
                    type: 'OAuth2',
                    user: user,
                    clientId: clientId,
                    clientSecret: clientSecret,
                    refreshToken: refresh_token,
                    accessToken: accessToken
                }
            })

            const mailOptions = {
                from: "Carey's App  <wait550000@gmail.com>",
                to: 'kattae.kattae@gmail.com',
                subject: "Need Help",
                text: contentHtml,
                html: contentHtml
            }

            const result = await transport.sendMail(mailOptions)

            return result

        } catch (error) {
            console.log(error)
            return error
        }
    }

    sendMail()
    .then(result => console.log('email sent...', result))
        .then(data => res.status(200).json({ msg: "email sent...", data }))
        .catch(error => console.log(error.message))
        .catch(error => res.status(500).json({ msg: error.message }))

}


module.exports = {
    sendEmailContact
}