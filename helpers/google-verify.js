const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const client = new OAuth2Client(CLIENT_ID);

async function googleVerify( token = '') { // nombre original de la function era verify
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    const { given_name, family_name, picture, email } = payload;

    return {
        firstName: given_name,
        lastName: family_name,
        email: email,
        img: picture
    }

    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}


module.exports = {
    googleVerify
}

// verify().catch(console.error);