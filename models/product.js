const { Schema, model } = require('mongoose')

const ProductSchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required']
        // unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stars: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    sold: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    urlImgThumb: {
        type: String,
    },
    description: {
        type: String,
    },
    available: {
        type: Boolean,
        default: true,
        required: true
    },
    img: {
        type: String
    },
    amount: {
        type: Number,
        default: 0,
    },
    color: {
        type: Object,
        default: ["brown", "blue", "red", "green", "yellow"],
        emun: ["brown", "blue", "red", "green", "yellow"]
    },
    totalPrice: {
        type: Number,
    },
    size: {
        type: Object,
        default: ["S", "M", "L", "XL"],
        emun: ["S", "M", "L", "XL"]
    }
});

// para eliminar cualquier otro dato que no quiera que el usuario final vea
ProductSchema.methods.toJSON = function () {
    const { __v, status, ...data } = this.toObject();
    return data;
}


module.exports = model('Product', ProductSchema);