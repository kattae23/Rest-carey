const { Schema, model } = require('mongoose')

const CategorySchema = Schema({
    name: {
        type: String,
        required: [true, 'The name is required'],
        unique: true
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
    enabled: {
        type: Boolean,
        default: true
    }
});

// para eliminar cualquier otro dato que no quiera que el usuario final vea
CategorySchema.methods.toJSON = function() {
    const { __v, status, ...data } = this.toObject();
    return data;
}


module.exports = model('Category', CategorySchema );