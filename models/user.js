
const { Schema, model } = require('mongoose')

const UserSchema = Schema({
    firstName: {
        type: String,
        required: [true, 'The first name is required']
    },
    lastName: {
        type: String,
        required: [true, 'The last name is required'],
    },
    stars: {
        type: Number,
        default: 0,
    },
    sales: {
        type: Number,
        default: 0,
    },
    productsSold: {
        type: Array,
        default: []
    },
    totalProductsPurchased: {
        type: Number,
        default: 0
    },
    totalProductsSold: {
        type: Number,
        default: 0
    },
    totalSpend: {
        type: Number,
        default: 0
    },
    totalSold: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        required: [true, 'The Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'The password is required'],
    },
    img: {
        type: String,
    },
    urlImgThumb: {
        type: String,
    },
    backgroundImg: {
        type: String,
    },
    urlBackgroundImgThumb: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
    address: {
        type: String,
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    zipcode: {
        type: Number
    },
    shippingcountry: {
        type: String,
    },
    shippingstate: {
        type: String,
    },
    sells: {
        type: Number,
    },
    reviews: {
        type: Array,
    },
    phone: {
        type: String
    },
    contactEmail: {
        type: String
    },
});


// para eliminar la contraseña y cualquier otro dato que no quiera que el usuario final vea
UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

module.exports = model('User', UserSchema);