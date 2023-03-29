
const { Schema, model, isValidObjectId } = require('mongoose')

const CheckoutSchema = Schema({
    user: {
        type: Object
    },
    order: {
        type: Number
    },
    // seller: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    seller: {
        type: Array,
        required: true
    },
    address: {
        type: Object
    },
    orderId: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    totalPrice: {
        type: String
    },
    cart: {
        type: Object
    },
    shipped: {
        type: Boolean,
        default: false
    }
});


// para eliminar la contraseña y cualquier otro dato que no quiera que el usuario final vea
// CheckoutSchema.methods.toJSON = function () {
//     const { __v, password, _id, ...checkout } = this.toObject();
//     checkout.uid = _id;
//     return checkout;
// }

module.exports = model('Checkout', CheckoutSchema);