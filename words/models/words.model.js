const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.plugin(mongoosePaginate);

const wordsSchema = new mongoose.Schema(
    {
        word: { type: String },
        createdAt: {type: Date, default: Date.now},
    }, 
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
)

wordsSchema.set('versionKey', 'version')

const wordsModel = mongoose.model('Word', wordsSchema)

module.exports = { wordsModel }