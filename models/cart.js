const { Schema, model } = require('mongoose')

const CartSchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
        // unique: true
    },
    products: {
        type: Object,
        default: {}
    },
    status: {
        type: Object,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String,
    },
    available: {
        type: Boolean,
        default: true,
        required: true
    }
});

// para eliminar cualquier otro dato que no quiera que el usuario final vea
CartSchema.methods.toJSON = function() {
    const { __v, status, ...data } = this.toObject();
    return data;
}


module.exports = model('Cart', CartSchema );