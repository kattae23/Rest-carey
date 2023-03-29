const { request, response } = require("express")


const isAdminRole = (req = request, res = response, next) => {

    if (!req.user) {
        return res.status(500).json({
            msg: 'You want to verify the role without validating the token first'
        })
    }

    const { role, firstName } = req.user

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${firstName} is not an administrator - cannot do that`
        })
    }
    next()
}

const haveRole = (...roles) => {



    return (req = request, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'You want to verify the role without validating the token first'
            })
        }
        if ( !roles.includes( req.user.role )) {
            return res.status(401).json({
                msg: `The service requires one of those roles ${ roles }`
            })
        }


        next()
    }

}


module.exports = {
    isAdminRole,
    haveRole
}